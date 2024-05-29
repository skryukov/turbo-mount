# frozen_string_literal: true

module Turbo
  module Mount
    module Helpers
      def turbo_mount(component_name, props: {}, tag: "div", **attrs, &block)
        raise TypeError, "Component name expected" unless component_name.is_a? String

        controller_name = "turbo-mount-#{component_name.underscore.dasherize}"
        attrs["data-controller"] = controller_name
        prefix = "data-#{controller_name}"
        attrs["#{prefix}-component-value"] = component_name
        attrs["#{prefix}-props-value"] = json_escape(props.to_json) if props.present?

        return content_tag(tag, nil, attrs) unless block

        content_tag(tag, nil, attrs) { capture(controller_name, &block) }
      end
      alias_method :turbo_mount_component, :turbo_mount
    end
  end
end
