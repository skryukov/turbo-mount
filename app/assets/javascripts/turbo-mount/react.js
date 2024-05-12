import { TurboMountController, TurboMount } from 'turbo-mount';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

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
class TurboMountReact extends TurboMount {
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { plugin }));
    }
}

export { TurboMountReact as TurboMount, TurboMountReact, plugin as default };
