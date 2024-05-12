import { TurboMountController, TurboMount } from 'turbo-mount';

class TurboMountSvelteController extends TurboMountController {
    constructor() {
        super(...arguments);
        this.framework = "svelte";
    }
    mountComponent(el, Component, props) {
        const component = new Component({ target: el, props });
        return () => {
            component.$destroy();
        };
    }
}

const plugin = {
    framework: "svelte",
    controller: TurboMountSvelteController,
};
class TurboMountSvelte extends TurboMount {
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { plugin }));
    }
}

export { TurboMountSvelte as TurboMount, TurboMountSvelte, plugin as default };
