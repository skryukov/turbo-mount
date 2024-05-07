# frozen_string_literal: true

module Turbo
  module Mount
    module Helpers
      def turbo_mount_component(component_name, framework:, props: {}, tag: "div", **attrs)
        raise TypeError, "Component name expected" unless component_name.is_a? String

        attrs["data-controller"] = "turbo-mount-#{framework}-#{component_name.underscore.dasherize}"
        prefix = "data-#{attrs["data-controller"]}"
        attrs["#{prefix}-component-value"] = component_name
        attrs["#{prefix}-props-value"] = json_escape(props.to_json) if props.present?

        content_tag(tag, nil, attrs)
      end

      def turbo_mount_react_component(component_name, **attrs)
        turbo_mount_component(component_name, framework: "react", **attrs)
      end

      def turbo_mount_svelte_component(component_name, **attrs)
        turbo_mount_component(component_name, framework: "svelte", **attrs)
      end

      def turbo_mount_vue_component(component_name, **attrs)
        turbo_mount_component(component_name, framework: "vue", **attrs)
      end
    end
  end
end
