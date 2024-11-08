import { buildRegisterFunction } from 'turbo-mount';
export { TurboMount } from 'turbo-mount';
import { mount, unmount } from 'svelte';

const plugin = {
    mountComponent: (mountProps) => {
        const { el, Component, props } = mountProps;
        const component = mount(Component, { target: el, props });
        return () => {
            unmount(component);
        };
    },
};
const registerComponent = buildRegisterFunction(plugin);

export { plugin as default, registerComponent };
