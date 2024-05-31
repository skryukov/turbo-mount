import { Controller, Application } from '@hotwired/stimulus';

class TurboMountController extends Controller {
    constructor() {
        super(...arguments);
        this.skipPropsChangeCallback = false;
    }
    connect() {
        this._umountComponentCallback || (this._umountComponentCallback = this.mountComponent(this.mountElement, this.resolvedComponent, this.componentProps));
    }
    disconnect() {
        this.umountComponent();
    }
    propsValueChanged() {
        if (this.skipPropsChangeCallback) {
            this.skipPropsChangeCallback = false;
            return;
        }
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
        return this.resolveMounted(this.componentValue).component;
    }
    get resolvedPlugin() {
        return this.resolveMounted(this.componentValue).plugin;
    }
    umountComponent() {
        this._umountComponentCallback && this._umountComponentCallback();
        this._umountComponentCallback = undefined;
    }
    mountComponent(el, Component, props) {
        return this.resolvedPlugin.mountComponent({ el, Component, props });
    }
    resolveMounted(component) {
        const app = this.application;
        return app.turboMount.resolve(component);
    }
    setComponentProps(props) {
        this.skipPropsChangeCallback = true;
        this.propsValue = props;
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
    constructor(props = {}) {
        this.components = new Map();
        this.application = this.findOrStartApplication(props.application);
        this.application.turboMount = this;
        this.application.register("turbo-mount", TurboMountController);
        document.addEventListener("turbo:before-morph-element", (event) => {
            var _a;
            const turboMorphEvent = event;
            const { target, detail } = turboMorphEvent;
            if ((_a = target.getAttribute("data-controller")) === null || _a === void 0 ? void 0 : _a.includes("turbo-mount")) {
                target.setAttribute("data-turbo-mount-props-value", detail.newElement.getAttribute("data-turbo-mount-props-value") ||
                    "{}");
                event.preventDefault();
            }
        });
    }
    register(plugin, name, component, controller) {
        controller || (controller = TurboMountController);
        if (this.components.has(name)) {
            throw new Error(`Component '${name}' is already registered.`);
        }
        this.components.set(name, { component, plugin });
        if (controller) {
            const controllerName = `turbo-mount-${camelToKebabCase(name)}`;
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
    findOrStartApplication(hydratedApp) {
        let application = hydratedApp || window.Stimulus;
        if (!application) {
            application = Application.start();
            window.Stimulus = application;
        }
        return application;
    }
}
function buildRegisterFunction(plugin) {
    return (turboMount, name, component, controller) => {
        turboMount.register(plugin, name, component, controller);
    };
}

export { TurboMount, TurboMountController, buildRegisterFunction };
