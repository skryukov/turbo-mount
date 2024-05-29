import { buildRegisterFunction } from 'turbo-mount';
export { TurboMount } from 'turbo-mount';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

const plugin = {
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

export { plugin as default, registerComponent };
