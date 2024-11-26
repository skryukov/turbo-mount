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

      class_option :interactive, type: :boolean, default: true,
        desc: "Whether to prompt for optional installations"

      class_option :verbose, type: :boolean, default: false,
        desc: "Run the generator in verbose mode"

      def install
        say "Installing Turbo Mount"

        package_manager.validate!

        create_initializer
        if package_manager.importmap?
          install_importmap
        else
          install_nodejs
        end

        say "Turbo Mount successfully installed", :green
      end

      private

      def create_initializer
        say "Creating Turbo Mount initializer"

        needs_alias = shakapacker? || package_manager.importmap?
        initializer_path = needs_alias ? "turbo-mount-initializer.js" : "turbo-mount.js"
        initializer_import = needs_alias ? %(import "turbo-mount-initializer"\n) : %(import "./turbo-mount"\n)

        template "turbo-mount.js", js_file_path(initializer_path)
        begin
          append_to_file js_entrypoint, initializer_import
        rescue
          say "Could not find the application entrypoint, please add `#{initializer_import.strip}` manually.", :yellow
        end
      end

      def install_nodejs
        package_manager.add_dependencies("turbo-mount", FRAMEWORKS[framework]["npm_packages"])

        warn_about_vite_plugin if vite?
      end

      def install_importmap
        say "Pinning Turbo Mount to the importmap"
        append_to_file "config/importmap.rb", %(pin "turbo-mount", to: "turbo-mount.min.js"\n)
        append_to_file "config/importmap.rb", %(pin "turbo-mount/#{framework}", to: "turbo-mount/#{framework}.min.js"\n)
        append_to_file "config/importmap.rb", %(pin "turbo-mount-initializer"\n)

        say "Pinning framework dependencies to the importmap"
        package_manager.add_dependencies(FRAMEWORKS[framework]["pins"])
      end

      def warn_about_vite_plugin
        say "Make sure to install and add #{FRAMEWORKS[framework]["vite_plugin"]} to your Vite config", :yellow
      end

      def package_manager
        @package_manager ||= JSPackageManager.new(self)
      end

      def extension
        FRAMEWORKS[framework]["extension"]
      end

      def framework
        @framework ||= options[:framework] || ask("What framework do you want to use with Turbo Mount?", :green, limited_to: FRAMEWORKS.keys, default: "react")
      end
    end
  end
end
