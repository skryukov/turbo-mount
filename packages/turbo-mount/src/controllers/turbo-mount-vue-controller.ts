import {TurboMountController} from "./turbo-mount-controller";

import { App } from "vue";

export class TurboMountVueController extends TurboMountController<App> {
    framework = "vue"

    async mountComponent(el: Element, Component: App, props: object) {
        const { createApp } = await import("vue");
        const app = createApp(Component, props as Record<string, unknown>);
        app.mount(el)

        return app.unmount
    }
}
