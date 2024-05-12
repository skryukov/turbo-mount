import { Application, ControllerConstructor } from "@hotwired/stimulus";

import { camelToKebabCase } from "./helpers";

declare global {
  interface Window {
    Stimulus?: Application;
  }
}

export interface ApplicationWithTurboMount<T> extends Application {
  turboMount: { [framework: string]: TurboMount<T> };
}

export type Plugin = {
  framework: string;
  controller: ControllerConstructor;
};

export type TurboMountProps = {
  application?: Application;
  plugin: Plugin;
};

export class TurboMount<T> {
  components: Map<string, T>;
  application: ApplicationWithTurboMount<T>;
  framework: string;
  baseController?: ControllerConstructor;

  constructor({ application, plugin }: TurboMountProps) {
    this.components = new Map();
    this.application = this.findOrStartApplication(application);
    this.framework = plugin.framework;
    this.baseController = plugin.controller;

    this.application.turboMount ||= {};
    this.application.turboMount[this.framework] = this;

    if (this.baseController) {
      this.application.register(
        `turbo-mount-${this.framework}`,
        this.baseController,
      );
    }
  }

  private findOrStartApplication(hydratedApp?: Application) {
    let application = hydratedApp || window.Stimulus;

    if (!application) {
      application = Application.start();
      window.Stimulus = application;
    }
    return application as ApplicationWithTurboMount<T>;
  }

  register(name: string, component: T, controller?: ControllerConstructor) {
    controller ||= this.baseController;
    if (this.components.has(name)) {
      throw new Error(`Component '${name}' is already registered.`);
    }
    this.components.set(name, component);

    if (controller) {
      const controllerName = `turbo-mount-${this.framework}-${camelToKebabCase(name)}`;
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
}
