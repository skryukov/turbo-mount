module TurboMount
  module Generators
    module Helpers
      ### FS Helpers
      def js_destination_path
        return ViteRuby.config.source_code_dir if defined?(ViteRuby)

        if file?("config/vite.json")
          source_code_dir = JSON.parse(File.read(file_path("config/vite.json"))).dig("all", "sourceCodeDir")
          return source_code_dir || "app/frontend"
        end

        "app/javascript"
      end

      def js_destination_root
        file_path(js_destination_path)
      end

      def js_entrypoint
        if vite?
          js_file_path "entrypoints/application.js"
        elsif shakapacker?
          js_file_path "packs/application.js"
        else
          js_file_path "application.js"
        end
      end

      def js_file_path(*relative_path)
        File.join(js_destination_root, *relative_path)
      end

      def file?(*relative_path)
        File.file?(file_path(*relative_path))
      end

      def file_path(*relative_path)
        File.join(destination_root, *relative_path)
      end

      def vite?
        file?("config/vite.json") && Dir.glob(file_path("vite.config.*")).any?
      end

      def shakapacker?
        file?("config/shakapacker.yml") || file?("config/webpacker.yml")
      end

      # Interactivity Helpers
      def ask(*)
        unless options[:interactive]
          say_error "Specify all options when running the generator non-interactively.", :red
          exit(1)
        end

        super
      end

      def yes?(*)
        return false unless options[:interactive]

        super
      end
    end
  end
end
