import {Application, ControllerConstructor} from '@hotwired/stimulus';

export interface ApplicationWithTurboMount<T> extends Application {
    turboMount: { [framework: string]: TurboMount<T> };
}

export type Plugin = {
    framework: string;
    controller: ControllerConstructor;
}

export class TurboMount<T> {
    components: Map<string, T>;
    application: ApplicationWithTurboMount<T>;
    framework: string;
    baseController?: ControllerConstructor;

    constructor(props: { application: Application, plugin: Plugin }) {
        this.components = new Map();
        this.application = props.application as ApplicationWithTurboMount<T>;
        this.framework = props.plugin.framework;
        this.baseController = props.plugin.controller;

        this.application.turboMount ||= {};
        this.application.turboMount[this.framework] = this;

        if (this.baseController) {
            this.application.register(`turbo-mount-${this.framework}`, this.baseController);
        }
    }

    register(name: string, component: T, controller?: ControllerConstructor) {
        controller ||= this.baseController;
        if (this.components.has(name)) {
            throw new Error(`Component '${name}' is already registered.`);
        }
        this.components.set(name, component);

        if (controller) {
            const controllerName = `turbo-mount-${this.framework}-${this.camelToKebabCase(name)}`;
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

    camelToKebabCase(str: string) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
}
