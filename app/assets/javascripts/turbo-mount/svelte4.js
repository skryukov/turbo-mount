import { buildRegisterFunction } from 'turbo-mount';
export { TurboMount } from 'turbo-mount';

const plugin = {
    mountComponent: (mountProps) => {
        const { el, Component, props } = mountProps;
        const component = new Component({ target: el, props });
        return () => {
            component.$destroy();
        };
    },
};
const registerComponent = buildRegisterFunction(plugin);

export { plugin as default, registerComponent };
