# frozen_string_literal: true

module Turbo
  module Mount
    module Helpers
      def turbo_mount_component(component_name, framework:, props: {}, tag: "div", **attrs, &block)
        raise TypeError, "Component name expected" unless component_name.is_a? String

        controller_name = "turbo-mount-#{framework}-#{component_name.underscore.dasherize}"
        attrs["data-controller"] = controller_name
        prefix = "data-#{controller_name}"
        attrs["#{prefix}-component-value"] = component_name
        attrs["#{prefix}-props-value"] = json_escape(props.to_json) if props.present?

        return content_tag(tag, nil, attrs) unless block

        content_tag(tag, nil, attrs) { capture(controller_name, &block) }
      end

      def turbo_mount_react_component(component_name, **attrs, &block)
        turbo_mount_component(component_name, framework: "react", **attrs, &block)
      end

      def turbo_mount_svelte_component(component_name, **attrs, &block)
        turbo_mount_component(component_name, framework: "svelte", **attrs, &block)
      end

      def turbo_mount_vue_component(component_name, **attrs, &block)
        turbo_mount_component(component_name, framework: "vue", **attrs, &block)
      end
    end
  end
end
