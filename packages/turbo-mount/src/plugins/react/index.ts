import { buildRegisterFunction, Plugin, TurboMount } from "turbo-mount";
import { ComponentType, createElement } from "react";
import { createRoot } from "react-dom/client";

const plugin: Plugin<ComponentType> = {
  mountComponent: (mountProps) => {
    const { el, Component, props } = mountProps;
    const root = createRoot(el);
    root.render(createElement(Component, props));

    return () => {
      root.unmount();
    };
  },
};

const registerComponent = buildRegisterFunction(plugin);

export { TurboMount, registerComponent };

export default plugin;
