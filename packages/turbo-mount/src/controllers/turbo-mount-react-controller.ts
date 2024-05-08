import {ComponentType} from "react";

import {TurboMountController} from "./turbo-mount-controller";

export class TurboMountReactController extends TurboMountController<ComponentType> {
    framework = "react"

    async mountComponent(el: Element, Component: ComponentType, props: object) {
        const {createRoot} = await import("react-dom/client");
        const root = createRoot(el);
        const {createElement} = await import("react");
        root.render(createElement(Component, props))

        return root.unmount
    }
}
