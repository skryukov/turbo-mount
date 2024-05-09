# frozen_string_literal: true

require "rails/engine"
require "turbo/mount/helpers"

module Turbo
  module Mount
    class Engine < Rails::Engine
      # If you don't want to precompile assets (e.g., you're using jsbundling),
      # you can do this in an initializer:
      #
      # config.after_initialize do
      #   config.assets.precompile -= Turbo::Mount::Engine::PRECOMPILE_ASSETS
      # end
      FILES = %w[turbo-mount turbo-mount/react turbo-mount/vue turbo-mount/svelte].freeze
      PRECOMPILE_ASSETS = FILES.flat_map do |framework|
        %w[js min.js min.js.map].map { |type| "#{framework}.#{type}" }
      end.freeze

      initializer "turbo-mount.assets" do
        if Rails.application.config.respond_to?(:assets)
          Rails.application.config.assets.precompile += PRECOMPILE_ASSETS
        end
      end

      initializer "turbo-mount.helpers" do
        ActiveSupport.on_load(:action_controller_base) do
          helper Turbo::Mount::Helpers
        end
      end
    end
  end
end
