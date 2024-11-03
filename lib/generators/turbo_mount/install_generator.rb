# frozen_string_literal: true

require "yaml"
require "rails/generators"
require "rails/generators/base"

require_relative "helpers"
require_relative "js_package_manager"

module TurboMount
  module Generators
    class InstallGenerator < Rails::Generators::Base
      include Helpers

      FRAMEWORKS = YAML.load_file(File.expand_path("./frameworks.yml", __dir__))

      source_root File.expand_path("install", __dir__)

      class_option :framework, type: :string,
        desc: "The framework you want to use with Turbo Mount",
        enum: FRAMEWORKS.keys,
        default: nil

      class_option :package_manager, type: :string, default: nil,
        enum: JSPackageManager.package_managers,
        desc: "The package manager you want to use to install Turbo Mount"

      class_option :verbose, type: :boolean, default: false,
        desc: "Run the generator in verbose mode"

      def install
        say "Installing Turbo Mount"

        package_manager.validate!

        if package_manager.importmap?
          install_importmap
        else
          install_nodejs
        end

        say "Turbo Mount successfully installed", :green
      end

      private

      def install_nodejs
        package_manager.add_dependencies("turbo-mount", FRAMEWORKS[framework][:npm_packages])

        say "Creating Turbo Mount initializer"
        template "turbo-mount.js", js_file_path("turbo-mount.js")
        begin
          append_to_file js_entrypoint, %(import "./turbo-mount"\n)
        rescue
          say 'Could not find the application entrypoint, please add `import "./turbo-mount"` manually.', :yellow
        end
        warn_about_vite_plugin if vite?
      end

      def install_importmap
        say "Creating Turbo Mount initializer"
        template "turbo-mount.js", js_file_path("turbo-mount-initializer.js")
        append_to_file "app/javascript/application.js", %(import "turbo-mount-initializer"\n)

        say "Pinning Turbo Mount to the importmap"
        append_to_file "config/importmap.rb", %(pin "turbo-mount", to: "turbo-mount.min.js"\n)
        append_to_file "config/importmap.rb", %(pin "turbo-mount/#{framework}", to: "turbo-mount/#{framework}.min.js"\n)
        append_to_file "config/importmap.rb", %(pin "turbo-mount-initializer"\n)

        say "Pinning framework dependencies to the importmap"
        package_manager.add_dependencies(FRAMEWORKS[framework][:pins])
      end

      def warn_about_vite_plugin
        say "Make sure to install and add #{FRAMEWORKS[framework][:vite_plugin]} to your Vite config", :yellow
      end

      def package_manager
        @package_manager ||= JSPackageManager.new(self)
      end

      def extension
        FRAMEWORKS[framework][:extension]
      end

      def framework
        @framework ||= options[:framework] || ask("What framework do you want to use with Turbo Mount?", :green, limited_to: FRAMEWORKS.keys, default: "react")
      end
    end
  end
end
