import {TurboMountController} from "./turbo-mount-controller";

import {ComponentType} from "svelte";

export class TurboMountSvelteController extends TurboMountController<ComponentType> {
    framework = "svelte"

    async mountComponent(el: Element, Component: ComponentType, props: object) {
        const component = new Component({ target: el, props })

        return component.$destroy
    }
}
