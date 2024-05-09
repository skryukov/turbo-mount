import {ComponentType} from "svelte";
import {TurboMountController} from "turbo-mount";

export class TurboMountSvelteController extends TurboMountController<ComponentType> {
    framework = "svelte"

    mountComponent(el: Element, Component: ComponentType, props: object) {
        const component = new Component({ target: el, props })

        return () => { component.$destroy() }
    }
}
