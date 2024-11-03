require "generator_spec"

require_relative "../../../../lib/generators/turbo_mount/install_generator"
require_relative "../../../../lib/generators/turbo_mount/js_package_manager"

RSpec.describe TurboMount::Generators::JSPackageManager do
  let(:generator) { instance_double(TurboMount::Generators::InstallGenerator) }
  let(:options) { {} }

  before do
    allow(generator).to receive(:options).and_return(options)
    allow(generator).to receive(:in_root).and_yield
    allow(generator).to receive(:run)
    allow(generator).to receive(:say)
    allow(generator).to receive(:file?)
  end

  describe ".package_managers" do
    it "returns the list of supported package managers" do
      expect(described_class.package_managers).to eq(%w[npm yarn bun pnpm importmap])
    end
  end

  describe "#validate!" do
    context "when package manager is present" do
      it "does not exit" do
        instance = described_class.new(generator)
        instance.instance_variable_set(:@package_manager, "npm")

        expect { instance.validate! }.not_to raise_error
      end
    end

    context "when package manager is not present" do
      it "prints an error message and exits" do
        instance = described_class.new(generator)
        instance.instance_variable_set(:@package_manager, nil)

        expect(generator).to receive(:say).with(
          "Could not find a package.json or config/importmap.rb file to add the turbo-mount dependency to, please add it manually.",
          :red
        )
        expect { instance.validate! }.to raise_error(SystemExit)
      end
    end
  end

  describe "#add_dependencies" do
    let(:instance) { described_class.new(generator) }

    context "when using importmap" do
      before do
        instance.instance_variable_set(:@package_manager, "importmap")
      end

      it "runs the correct command for importmap" do
        expect(generator).to receive(:run).with("bin/importmap pin dep1 dep2")
        instance.add_dependencies("dep1", "dep2")
      end
    end

    context "when using npm" do
      before do
        instance.instance_variable_set(:@package_manager, "npm")
      end

      it "runs the correct command for npm" do
        expect(generator).to receive(:run).with("npm add dep1 dep2 --silent")
        instance.add_dependencies("dep1", "dep2")
      end

      it "includes verbose flag when specified" do
        options[:verbose] = true
        expect(generator).to receive(:run).with("npm add dep1 dep2")
        instance.add_dependencies("dep1", "dep2")
      end
    end
  end

  describe "#detect_package_manager" do
    let(:instance) { described_class.new(generator) }

    it "detects npm when package.json and package-lock.json exist" do
      allow(generator).to receive(:file?).with("package.json").and_return(true)
      allow(generator).to receive(:file?).with("package-lock.json").and_return(true)

      expect(instance.send(:detect_package_manager)).to eq("npm")
    end

    it "detects pnpm when package.json and pnpm-lock.yaml exist" do
      allow(generator).to receive(:file?).with("package.json").and_return(true)
      allow(generator).to receive(:file?).with("package-lock.json").and_return(false)
      allow(generator).to receive(:file?).with("pnpm-lock.yaml").and_return(true)

      expect(instance.send(:detect_package_manager)).to eq("pnpm")
    end

    it "detects bun when package.json and bun.lockb exist" do
      allow(generator).to receive(:file?).with("package.json").and_return(true)
      allow(generator).to receive(:file?).with("package-lock.json").and_return(false)
      allow(generator).to receive(:file?).with("pnpm-lock.yaml").and_return(false)
      allow(generator).to receive(:file?).with("bun.lockb").and_return(true)

      expect(instance.send(:detect_package_manager)).to eq("bun")
    end

    it "defaults to yarn when package.json exists but no specific lock file is found" do
      allow(generator).to receive(:file?).with("package.json").and_return(true)
      allow(generator).to receive(:file?).with("package-lock.json").and_return(false)
      allow(generator).to receive(:file?).with("pnpm-lock.yaml").and_return(false)
      allow(generator).to receive(:file?).with("bun.lockb").and_return(false)

      expect(instance.send(:detect_package_manager)).to eq("yarn")
    end

    it "detects importmap when config/importmap.rb exists" do
      allow(generator).to receive(:file?).with("package.json").and_return(false)
      allow(generator).to receive(:file?).with("config/importmap.rb").and_return(true)

      expect(instance.send(:detect_package_manager)).to eq("importmap")
    end

    it "returns nil when no package manager can be detected" do
      allow(generator).to receive(:file?).and_return(false)

      expect(instance.send(:detect_package_manager)).to be_nil
    end
  end
end
