import { Controller, Application } from '@hotwired/stimulus';

class TurboMountController extends Controller {
    connect() {
        this._umountComponentCallback || (this._umountComponentCallback = this.mountComponent(this.mountElement, this.resolvedComponent, this.componentProps));
    }
    disconnect() {
        this.umountComponent();
    }
    propsValueChanged() {
        this.umountComponent();
        this._umountComponentCallback || (this._umountComponentCallback = this.mountComponent(this.mountElement, this.resolvedComponent, this.componentProps));
    }
    get componentProps() {
        return this.propsValue;
    }
    get mountElement() {
        return this.hasMountTarget ? this.mountTarget : this.element;
    }
    get resolvedComponent() {
        return this.resolveComponent(this.componentValue);
    }
    umountComponent() {
        this._umountComponentCallback && this._umountComponentCallback();
        this._umountComponentCallback = undefined;
    }
    resolveComponent(component) {
        const app = this.application;
        return app.turboMount[this.framework].resolve(component);
    }
}
TurboMountController.values = {
    props: Object,
    component: String,
};
TurboMountController.targets = ["mount"];

const camelToKebabCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

class TurboMount {
    constructor({ application, plugin }) {
        var _a;
        this.components = new Map();
        this.application = this.findOrStartApplication(application);
        this.framework = plugin.framework;
        this.baseController = plugin.controller;
        (_a = this.application).turboMount || (_a.turboMount = {});
        this.application.turboMount[this.framework] = this;
        if (this.baseController) {
            this.application.register(`turbo-mount-${this.framework}`, this.baseController);
        }
    }
    findOrStartApplication(hydratedApp) {
        let application = hydratedApp || window.Stimulus;
        if (!application) {
            application = Application.start();
            window.Stimulus = application;
        }
        return application;
    }
    register(name, component, controller) {
        controller || (controller = this.baseController);
        if (this.components.has(name)) {
            throw new Error(`Component '${name}' is already registered.`);
        }
        this.components.set(name, component);
        if (controller) {
            const controllerName = `turbo-mount-${this.framework}-${camelToKebabCase(name)}`;
            this.application.register(controllerName, controller);
        }
    }
    resolve(name) {
        const component = this.components.get(name);
        if (!component) {
            throw new Error(`Unknown component: ${name}`);
        }
        return component;
    }
}

export { TurboMount, TurboMountController };
