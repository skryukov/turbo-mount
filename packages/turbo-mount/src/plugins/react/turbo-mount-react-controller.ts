import { ComponentType, createElement } from "react";
import { createRoot } from "react-dom/client";
import { TurboMountController } from "turbo-mount";

export class TurboMountReactController extends TurboMountController<ComponentType> {
  framework = "react";

  mountComponent(el: Element, Component: ComponentType, props: object) {
    const root = createRoot(el);
    root.render(createElement(Component, props));

    return () => {
      root.unmount();
    };
  }
}
