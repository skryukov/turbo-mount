import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { TurboMountController } from 'turbo-mount';

class TurboMountReactController extends TurboMountController {
    constructor() {
        super(...arguments);
        this.framework = "react";
    }
    mountComponent(el, Component, props) {
        const root = createRoot(el);
        root.render(createElement(Component, props));
        return () => {
            root.unmount();
        };
    }
}

const plugin = {
    framework: "react",
    controller: TurboMountReactController,
};

export { plugin as default };
