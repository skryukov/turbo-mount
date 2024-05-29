import { buildRegisterFunction, Plugin, TurboMount } from "turbo-mount";
import { ComponentType } from "svelte";

const plugin: Plugin<ComponentType> = {
  mountComponent: (mountProps) => {
    const { el, Component, props } = mountProps;
    const component = new Component({ target: el, props });

    return () => {
      component.$destroy();
    };
  },
};

const registerComponent = buildRegisterFunction(plugin);

export { TurboMount, registerComponent };

export default plugin;
