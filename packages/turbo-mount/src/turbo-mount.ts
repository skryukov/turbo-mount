import { Application, ControllerConstructor } from "@hotwired/stimulus";

import { camelToKebabCase } from "./helpers";
import { TurboMountController } from "./turbo-mount-controller";

declare global {
  interface Window {
    Stimulus?: Application;
  }
}

export interface ApplicationWithTurboMount extends Application {
  turboMount: TurboMount;
}

export type MountComponentProps<T> = {
  el: Element;
  Component: T;
  props: object;
};

export type Plugin<T> = {
  mountComponent: (props: MountComponentProps<T>) => () => void;
};

export type TurboMountProps = {
  application?: Application;
};

type TurboMountComponents<T> = Map<string, { component: T; plugin: Plugin<T> }>;

interface TurboMorphEvent extends CustomEvent {
  target: Element;
  detail: {
    newElement: Element;
  };
}

export class TurboMount {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: TurboMountComponents<any>;
  application: ApplicationWithTurboMount;

  constructor(props: TurboMountProps = {}) {
    this.components = new Map();
    this.application = this.findOrStartApplication(props.application);
    this.application.turboMount = this;
    this.application.register("turbo-mount", TurboMountController);

    document.addEventListener("turbo:before-morph-element", (event) => {
      const turboMorphEvent = event as unknown as TurboMorphEvent;
      const { target, detail } = turboMorphEvent;

      const controllerAttr = target.getAttribute("data-controller");
      if (controllerAttr?.includes("turbo-mount")) {
        const turboMountController = controllerAttr
          .split(/\s+/)
          .find((name) => name.startsWith("turbo-mount"));

        if (turboMountController) {
          const propsAttrName = `data-${turboMountController}-props-value`;
          const newPropsValue =
            detail.newElement.getAttribute(propsAttrName) || "{}";
          target.setAttribute(propsAttrName, newPropsValue);
          event.preventDefault();
        }
      }
    });
  }

  register<T>(
    plugin: Plugin<T>,
    name: string,
    component: T,
    controller?: ControllerConstructor,
  ) {
    controller ||= TurboMountController;
    if (this.components.has(name)) {
      throw new Error(`Component '${name}' is already registered.`);
    }
    this.components.set(name, { component, plugin });

    if (controller) {
      const controllerName = `turbo-mount-${camelToKebabCase(name)}`;
      this.application.register(controllerName, controller);
    }
  }

  resolve(name: string) {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Unknown component: ${name}`);
    }
    return component;
  }

  private findOrStartApplication(hydratedApp?: Application) {
    let application = hydratedApp || window.Stimulus;

    if (!application) {
      application = Application.start();
      window.Stimulus = application;
    }
    return application as ApplicationWithTurboMount;
  }
}

export function buildRegisterFunction<T>(plugin: Plugin<T>) {
  return (
    turboMount: TurboMount,
    name: string,
    component: T,
    controller?: ControllerConstructor,
  ) => {
    turboMount.register(plugin, name, component, controller);
  };
}
