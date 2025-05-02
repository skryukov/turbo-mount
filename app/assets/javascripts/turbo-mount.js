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
        this._umountComponentCallback?.();
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
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/_/g, "-")
        .replace(/\//g, "--")
        .toLowerCase();
};
const normalizeFilenameToComponentName = (filename) => {
    return filename
        .replace(/\.\w*$/, "")
        .replace(/^[./]*components\//, "");
};
const generateStimulusIdentifiers = (componentName) => {
    const kebabCaseName = camelToKebabCase(componentName);
    return [`turbo-mount--${kebabCaseName}`, `turbo-mount-${kebabCaseName}`];
};
const getShortNameForIndexComponent = (componentName) => {
    if (componentName.endsWith("/index")) {
        const shortName = componentName.replace(/\/index$/, "");
        return shortName || null;
    }
    return null;
};

class TurboMount {
    constructor(props = {}) {
        this.components = new Map();
        this.application = this.findOrStartApplication(props.application);
        this.application.turboMount = this;
        this.application.register("turbo-mount", TurboMountController);
        document.addEventListener("turbo:before-morph-element", (event) => {
            const turboMorphEvent = event;
            const { target, detail } = turboMorphEvent;
            if (target.getAttribute("data-controller")?.includes("turbo-mount")) {
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

const registerComponentsBase = ({ plugin, turboMount, components, controllers = [], }) => {
    const registeredNames = new Set();
    const indexComponentsToRegisterLater = [];
    for (const { filename, module } of components) {
        const componentName = normalizeFilenameToComponentName(filename);
        const component = module.default ?? module;
        registerSingleComponent({
            plugin,
            turboMount,
            availableControllers: controllers,
            componentName,
            component,
        });
        registeredNames.add(componentName);
        const shortName = getShortNameForIndexComponent(componentName);
        if (shortName) {
            indexComponentsToRegisterLater.push({ name: shortName, module });
        }
    }
    for (const { name: shortName, module } of indexComponentsToRegisterLater) {
        if (!registeredNames.has(shortName)) {
            const component = module.default ?? module;
            registerSingleComponent({
                plugin,
                turboMount,
                availableControllers: controllers,
                componentName: shortName,
                component,
            });
            registeredNames.add(shortName);
        }
    }
};
const registerSingleComponent = ({ plugin, turboMount, availableControllers, componentName, component, }) => {
    const potentialIdentifiers = generateStimulusIdentifiers(componentName);
    const controllerDefinition = availableControllers.find(({ identifier }) => potentialIdentifiers.includes(identifier));
    if (controllerDefinition) {
        turboMount.register(plugin, componentName, component, controllerDefinition.controllerConstructor);
    }
    else {
        turboMount.register(plugin, componentName, component);
    }
};

export { TurboMount, TurboMountController, buildRegisterFunction, registerComponentsBase };
