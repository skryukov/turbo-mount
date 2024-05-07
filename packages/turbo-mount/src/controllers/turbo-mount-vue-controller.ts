import {TurboMountController} from "./turbo-mount-controller";

import { createApp, App } from "vue";

export class TurboMountVueController extends TurboMountController<App> {
    framework = "vue"

    mountComponent(el: Element, Component: App, props: object) {
        const app = createApp(Component, props as Record<string, unknown>);
        app.mount(el)

        return app.unmount
    }
}
