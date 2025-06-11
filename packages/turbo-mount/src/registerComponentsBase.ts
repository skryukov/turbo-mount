import { Definition } from "@hotwired/stimulus";

import { TurboMount, Plugin } from "./turbo-mount";
import {
  getShortNameForIndexComponent,
  normalizeFilenameToComponentName,
  generateStimulusIdentifiers,
} from "./helpers";

export type ComponentModule = { default: never } | never;

export type ComponentDefinition = {
  filename: string;
  module: ComponentModule;
};

type RegisterComponentsProps<T> = {
  plugin: Plugin<T>;
  turboMount: TurboMount;
  components: ComponentDefinition[];
  controllers?: Definition[];
};

// Registers multiple components with TurboMount, potentially linking them
// to Stimulus controllers based on naming conventions. Handles index
// components by registering them under both their full path and the parent
// directory name if available.
export const registerComponentsBase = <T>({
  plugin,
  turboMount,
  components,
  controllers = [],
}: RegisterComponentsProps<T>) => {
  const registeredNames = new Set<string>();
  const indexComponentsToRegisterLater: Array<{
    name: string;
    module: ComponentModule;
  }> = [];

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

    // If component path ends with /index, prepare for possible registration
    // under the shorter directory name in the second pass.
    const shortName = getShortNameForIndexComponent(componentName);
    if (shortName) {
      indexComponentsToRegisterLater.push({ name: shortName, module });
    }
  }

  // Second Pass: Register 'index' components using their shorter directory name
  // This pass ensures that an explicit component (e.g., 'button.js') takes
  // precedence over an index component (e.g., 'button/index.js') if both
  // would resolve to the same short name ('button').
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

const registerSingleComponent = <T>({
  plugin,
  turboMount,
  availableControllers,
  componentName,
  component,
}: {
  plugin: Plugin<T>;
  turboMount: TurboMount;
  availableControllers: Definition[];
  componentName: string;
  component: T;
}) => {
  const potentialIdentifiers = generateStimulusIdentifiers(componentName);

  const controllerDefinition = availableControllers.find(({ identifier }) =>
    potentialIdentifiers.includes(identifier),
  );

  if (controllerDefinition) {
    turboMount.register(
      plugin,
      componentName,
      component,
      controllerDefinition.controllerConstructor,
    );
  } else {
    turboMount.register(plugin, componentName, component);
  }
};
