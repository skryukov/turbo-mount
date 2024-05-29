import { buildRegisterFunction, Plugin, TurboMount } from "turbo-mount";
import { App, createApp } from "vue";

const plugin: Plugin<App> = {
  mountComponent: (mountProps) => {
    const { el, Component, props } = mountProps;
    const app = createApp(Component, props as Record<string, unknown>);
    app.mount(el);

    return () => {
      app.unmount();
    };
  },
};

const registerComponent = buildRegisterFunction(plugin);

export { TurboMount, registerComponent };

export default plugin;
