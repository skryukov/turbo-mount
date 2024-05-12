import {definitionsFromGlob} from "stimulus-vite-helpers";
import {Definition} from "@hotwired/stimulus"

import {TurboMount} from "turbo-mount";

import {camelToKebabCase} from "./helpers";

type RegisterComponentsProps = {
    turboMount: TurboMount<any>;
    components: Record<string, any>;
    controllers?: Record<string, Definition>;
}

const identifierNames = (name: string, turboMount: TurboMount<any>) => {
    const controllerName = camelToKebabCase(name);
    const framework = turboMount.framework;

    return [
        `turbo-mount--${framework}--${controllerName}`,
        `turbo-mount--${framework}-${controllerName}`,
        `turbo-mount-${framework}-${controllerName}`,
        `turbo-mount--${controllerName}`,
        `turbo-mount-${controllerName}`
    ];
}

export const registerComponents = ({turboMount, components, controllers}: RegisterComponentsProps) => {
    const controllerModules = controllers ? definitionsFromGlob(controllers) : [];

    for (const [componentPath, componentModule] of Object.entries(components)) {
        const name = componentPath.replace(/\.\w*$/, "")
            .replace(/^[.\/]*components\//, '');

        const identifiers = identifierNames(name, turboMount);

        const controller = controllerModules.find(({identifier}) => identifiers.includes(identifier));
        const component = componentModule.default ?? componentModule;

        if (controller) {
            turboMount.register(name, component, controller.controllerConstructor);
        } else {
            turboMount.register(name, component);
        }
    }
}
