# frozen_string_literal: true

module TurboMount
  module Generators
    class InstallGenerator < Rails::Generators::Base
      FRAMEWORKS = {
        "react" => {
          pins: "react react-dom react-dom/client",
          npm_packages: "react react-dom",
          vite_plugin: "@vitejs/plugin-react"
        },
        "vue" => {
          pins: "vue",
          npm_packages: "vue",
          vite_plugin: "@vitejs/plugin-vue"
        },
        "svelte" => {
          pins: "svelte",
          npm_packages: "svelte",
          vite_plugin: "@sveltejs/vite-plugin-svelte"
        }
      }.freeze

      source_root File.expand_path("install", __dir__)

      def install
        say "Installing Turbo Mount"

        if build_tool.nil?
          say "Could not find a package.json or config/importmap.rb file to add the turbo-mount dependency to, please add it manually.", :red
          exit!
        end

        if importmap?
          install_importmap
        else
          install_nodejs
        end

        say "Turbo Mount successfully installed", :green
      end

      private

      def install_nodejs
        case build_tool
        when "npm"
          run "npm install turbo-mount #{FRAMEWORKS[framework][:npm_packages]}"
        when "yarn"
          run "yarn add turbo-mount #{FRAMEWORKS[framework][:npm_packages]}"
        when "bun"
          run "bun add turbo-mount #{FRAMEWORKS[framework][:npm_packages]}"
        end

        say "Creating Turbo Mount initializer"
        template "turbo-mount.js", File.join("app/javascript/turbo-mount.js")
        begin
          append_to_file js_entrypoint, %(import "./turbo-mount"\n)
        rescue
          say 'Could not find the application entrypoint, please add `import "./turbo-mount"` manually.', :yellow
        end
        warn_about_vite_plugin if vite?
      end

      def install_importmap
        say "Creating Turbo Mount initializer"
        template "turbo-mount.js", File.join("app/javascript/turbo-mount-initializer.js")
        append_to_file "app/javascript/application.js", %(import "turbo-mount-initializer"\n)

        say "Pinning Turbo Mount to the importmap"
        append_to_file "config/importmap.rb", %(pin "turbo-mount", to: "turbo-mount.min.js"\n)
        append_to_file "config/importmap.rb", %(pin "turbo-mount/#{framework}", to: "turbo-mount/#{framework}.min.js"\n)
        append_to_file "config/importmap.rb", %(pin "turbo-mount-initializer"\n)

        say "Pinning framework dependencies to the importmap"
        run "bin/importmap pin #{FRAMEWORKS[framework][:pins]}"
      end

      def js_entrypoint
        if vite?
          "app/javascript/entrypoints/application.js"
        else
          "app/javascript/application.js"
        end
      end

      def vite?
        Dir.glob(Rails.root.join("vite.config.*")).any?
      end

      def importmap?
        build_tool == "importmap"
      end

      def warn_about_vite_plugin
        say "Make sure to install and add #{FRAMEWORKS[framework][:vite_plugin]} to your Vite config", :yellow
      end

      def build_tool
        return @build_tool if defined?(@build_tool)

        @build_tool = detect_build_tool
      end

      def detect_build_tool
        if Rails.root.join("package.json").exist?
          if Rails.root.join("package-lock.json").exist?
            "npm"
          elsif Rails.root.join("bun.config.js").exist?
            "bun"
          else
            "yarn"
          end
        elsif Rails.root.join("config/importmap.rb").exist?
          "importmap"
        end
      end

      def framework
        @framework ||= ask("What framework do you want to use with Turbo Mount?", limited_to: FRAMEWORKS.keys, default: "react")
      end
    end
  end
end
