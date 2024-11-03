require_relative "../../../../lib/generators/turbo_mount/install_generator"
require "generator_spec"

RSpec.describe TurboMount::Generators::InstallGenerator, type: :generator do
  destination File.expand_path("../../../../../tmp", __FILE__)

  let(:args) { %W[--framework=#{framework} --package-manager=#{package_manager} --no-interactive] }
  let(:framework) { :react }
  let(:package_manager) { :importmap }

  subject(:generator) { run_generator(args) }

  before do
    prepare_destination
    FileUtils.cp_r(Dir["spec/fixtures/with_vite/*"], destination_root) if package_manager != :importmap
    FileUtils.cp_r(Dir["spec/fixtures/with_importmap/*"], destination_root) if package_manager == :importmap
  end

  context "with --package-manager=importmap" do
    context "with --framework=svelte" do
      let(:framework) { :svelte }

      it "builds the correct structure" do
        expect { generator }.not_to raise_error

        expect(destination_root).to(have_structure do
          file("app/javascript/application.js") do
            contains('import "turbo-mount-initializer"')
          end
          file("app/javascript/turbo-mount-initializer.js") do
            contains('import { registerComponent } from "turbo-mount/svelte"')
          end
          file("config/importmap.rb") do
            contains('pin "turbo-mount", to: "turbo-mount.min.js"')
            contains('pin "turbo-mount-initializer"')
            contains('pin "turbo-mount/svelte", to: "turbo-mount/svelte.min.js"')
          end
        end)
      end
    end

    context "with --framework=svelte4" do
      let(:framework) { :svelte4 }

      it "builds the correct structure" do
        expect { generator }.not_to raise_error

        expect(destination_root).to(have_structure do
          file("app/javascript/application.js") do
            contains('import "turbo-mount-initializer"')
          end
          file("app/javascript/turbo-mount-initializer.js") do
            contains('import { registerComponent } from "turbo-mount/svelte4"')
          end
          file("config/importmap.rb") do
            contains('pin "turbo-mount", to: "turbo-mount.min.js"')
            contains('pin "turbo-mount-initializer"')
            contains('pin "turbo-mount/svelte4", to: "turbo-mount/svelte4.min.js"')
          end
        end)
      end
    end

    context "with --framework=react" do
      let(:framework) { :react }

      it "builds the correct structure" do
        expect { generator }.not_to raise_error

        expect(destination_root).to(have_structure do
          file("app/javascript/application.js") do
            contains('import "turbo-mount-initializer"')
          end
          file("app/javascript/turbo-mount-initializer.js") do
            contains('import { registerComponent } from "turbo-mount/react"')
          end
          file("config/importmap.rb") do
            contains('pin "turbo-mount", to: "turbo-mount.min.js"')
            contains('pin "turbo-mount-initializer"')
            contains('pin "turbo-mount/react", to: "turbo-mount/react.min.js"')
          end
        end)
      end
    end

    context "with --framework=vue" do
      let(:framework) { :vue }

      it "builds the correct structure" do
        expect { generator }.not_to raise_error

        expect(destination_root).to(have_structure do
          file("app/javascript/application.js") do
            contains('import "turbo-mount-initializer"')
          end
          file("app/javascript/turbo-mount-initializer.js") do
            contains('import { registerComponent } from "turbo-mount/vue"')
          end
          file("config/importmap.rb") do
            contains('pin "turbo-mount", to: "turbo-mount.min.js"')
            contains('pin "turbo-mount-initializer"')
            contains('pin "turbo-mount/vue", to: "turbo-mount/vue.min.js"')
          end
        end)
      end
    end
  end

  context "with --package-manager=npm" do
    let(:package_manager) { :npm }

    context "with --framework=svelte" do
      let(:framework) { :svelte }

      it "builds the correct structure" do
        expect { generator }.not_to raise_error

        expect(destination_root).to(have_structure do
          file("app/frontend/entrypoints/application.js") do
            contains('import "./turbo-mount"')
          end
          file("app/frontend/turbo-mount.js") do
            contains('import { registerComponent } from "turbo-mount/svelte"')
          end
          file("package.json") do
            contains('"turbo-mount":')
          end
        end)
      end
    end

    context "with --framework=svelte4" do
      let(:framework) { :svelte4 }

      it "builds the correct structure" do
        expect { generator }.not_to raise_error

        expect(destination_root).to(have_structure do
          file("app/frontend/entrypoints/application.js") do
            contains('import "./turbo-mount"')
          end
          file("app/frontend/turbo-mount.js") do
            contains('import { registerComponent } from "turbo-mount/svelte4"')
          end
          file("package.json") do
            contains('"turbo-mount":')
          end
        end)
      end
    end

    context "with --framework=react" do
      let(:framework) { :react }

      it "builds the correct structure" do
        expect { generator }.not_to raise_error

        expect(destination_root).to(have_structure do
          file("app/frontend/entrypoints/application.js") do
            contains('import "./turbo-mount"')
          end
          file("app/frontend/turbo-mount.js") do
            contains('import { registerComponent } from "turbo-mount/react"')
          end
          file("package.json") do
            contains('"turbo-mount":')
          end
        end)
      end
    end

    context "with --framework=vue" do
      let(:framework) { :vue }

      it "builds the correct structure" do
        expect { generator }.not_to raise_error

        expect(destination_root).to(have_structure do
          file("app/frontend/entrypoints/application.js") do
            contains('import "./turbo-mount"')
          end
          file("app/frontend/turbo-mount.js") do
            contains('import { registerComponent } from "turbo-mount/vue"')
          end
          file("package.json") do
            contains('"turbo-mount":')
          end
        end)
      end
    end
  end
end
