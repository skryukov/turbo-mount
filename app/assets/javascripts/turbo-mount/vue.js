import { TurboMountController, TurboMount } from 'turbo-mount';
import { createApp } from 'vue';

class TurboMountVueController extends TurboMountController {
    constructor() {
        super(...arguments);
        this.framework = "vue";
    }
    mountComponent(el, Component, props) {
        const app = createApp(Component, props);
        app.mount(el);
        return () => {
            app.unmount();
        };
    }
}

const plugin = {
    framework: "vue",
    controller: TurboMountVueController,
};
class TurboMountVue extends TurboMount {
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { plugin }));
    }
}

export { TurboMountVue as TurboMount, TurboMountVue, plugin as default };
