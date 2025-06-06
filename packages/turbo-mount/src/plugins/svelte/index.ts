import { buildRegisterFunction, Plugin, TurboMount } from "turbo-mount";
import { Component, mount, unmount } from "svelte";

const plugin: Plugin<Component> = {
  mountComponent: (mountProps) => {
    const { el, Component, props } = mountProps;
    const component = mount(Component, { target: el, props });
    return () => {
      unmount(component);
    };
  },
};

const registerComponent = buildRegisterFunction(plugin);

export { TurboMount, registerComponent };

export default plugin;
