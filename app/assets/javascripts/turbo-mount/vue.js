import { createApp } from 'vue';
import { TurboMountController } from 'turbo-mount';

class TurboMountVueController extends TurboMountController {
    constructor() {
        super(...arguments);
        this.framework = "vue";
    }
    mountComponent(el, Component, props) {
        const app = createApp(Component, props);
        app.mount(el);
        return () => { app.unmount(); };
    }
}

const plugin = {
    framework: "vue",
    controller: TurboMountVueController
};

export { plugin as default };
