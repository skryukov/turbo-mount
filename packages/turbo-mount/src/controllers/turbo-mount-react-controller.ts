import {ComponentType} from "react";

import {TurboMountController} from "./turbo-mount-controller";

export class TurboMountReactController extends TurboMountController<ComponentType> {
    framework = "react"

    async mountComponent(el: Element, Component: ComponentType, props: object) {
        const [reactDom, react] = await Promise.all([
            import("react-dom/client"),
            import("react")
        ]);
        const root = reactDom.createRoot(el);
        root.render(react.createElement(Component, props))

        return root.unmount
    }
}
