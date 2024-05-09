import { TurboMountController } from 'turbo-mount';

class TurboMountSvelteController extends TurboMountController {
    constructor() {
        super(...arguments);
        this.framework = "svelte";
    }
    mountComponent(el, Component, props) {
        const component = new Component({ target: el, props });
        return () => { component.$destroy(); };
    }
}

const plugin = {
    framework: "svelte",
    controller: TurboMountSvelteController
};

export { plugin as default };
