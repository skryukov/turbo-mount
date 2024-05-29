import { buildRegisterFunction } from 'turbo-mount';
export { TurboMount } from 'turbo-mount';
import { createApp } from 'vue';

const plugin = {
    mountComponent: (mountProps) => {
        const { el, Component, props } = mountProps;
        const app = createApp(Component, props);
        app.mount(el);
        return () => {
            app.unmount();
        };
    },
};
const registerComponent = buildRegisterFunction(plugin);

export { plugin as default, registerComponent };
