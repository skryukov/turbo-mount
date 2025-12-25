module TurboMount
  module Generators
    class JSPackageManager
      def self.package_managers
        %w[npm yarn bun pnpm importmap]
      end

      def initialize(generator)
        @generator = generator
        @package_manager = generator.options[:package_manager] || detect_package_manager
      end

      def validate!
        return if @package_manager.present?

        @generator.say "Could not find a package.json or config/importmap.rb file to add the turbo-mount dependency to, please add it manually.", :red
        exit(1)
      end

      def importmap?
        @package_manager == "importmap"
      end

      def add_dependencies(*dependencies)
        cmd =
          if importmap?
            "bin/importmap pin #{dependencies.join(" ")}"
          else
            "#{@package_manager} add #{dependencies.join(" ")}#{" --silent" unless @generator.options[:verbose]}"
          end
        @generator.in_root { @generator.run cmd }
      end

      private

      def detect_package_manager
        if file?("package.json")
          if file?("package-lock.json")
            "npm"
          elsif file?("pnpm-lock.yaml")
            "pnpm"
          elsif file?("bun.lockb")
            "bun"
          else
            "yarn"
          end
        elsif file?("config/importmap.rb")
          "importmap"
        end
      end

      def file?(*relative_path)
        @generator.file?(*relative_path)
      end
    end
  end
end
