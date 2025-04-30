import { Definition } from "@hotwired/stimulus";

import { TurboMount, Plugin } from "./turbo-mount";
import { camelToKebabCase } from "./helpers";

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

// Normalizes a component filename into a standardized component name.
// Example: './components/users/UserProfile.tsx' -> 'users/user-profile'
// Example: 'global/utility/debounce_button.js' -> 'global/utility/debounce-button'
const normalizeFilenameToComponentName = (filename: string): string => {
  return (
    filename
      .replace(/\.\w*$/, "")
      .replace(/^[./]*components\//, "")
      .split('/')
      .map(part => camelToKebabCase(part).replace(/_/g, "-"))
      .join('/')
  );
};

const generateStimulusIdentifiers = (componentName: string): string[] => {
  const baseIdentifier = componentName.replace(/\//g, "--");
  return [`turbo-mount--${baseIdentifier}`, `turbo-mount-${baseIdentifier}`];
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
  const indexComponentsToRegisterLater: Array<{ name: string; module: ComponentModule }> = [];

  for (const { filename, module } of components) {
    const componentName = normalizeFilenameToComponentName(filename);
    const component = module.default ?? module;

    console.debug(`[TurboMount Registration] Attempting to register: ${componentName} from ${filename}`);

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
    if (componentName.endsWith("/index")) {
      const shortName = componentName.replace(/\/index$/, "");
      if (shortName) {
          indexComponentsToRegisterLater.push({ name: shortName, module });
          console.debug(`[TurboMount Registration] Queuing index component for short name registration: ${shortName}`);
      }
    }
  }

  // Second Pass: Register 'index' components using their shorter directory name
  // This pass ensures that an explicit component (e.g., 'button.js') takes
  // precedence over an index component (e.g., 'button/index.js') if both
  // would resolve to the same short name ('button').
  for (const { name: shortName, module } of indexComponentsToRegisterLater) {
    if (!registeredNames.has(shortName)) {
        const component = module.default ?? module;

        console.debug(`[TurboMount Registration] Attempting to register index component with short name: ${shortName}`);

        registerSingleComponent({
            plugin,
            turboMount,
            availableControllers: controllers,
            componentName: shortName,
            component,
      });
      registeredNames.add(shortName);
    } else {
        console.debug(`[TurboMount Registration] Skipping short name registration for '${shortName}' as it's already registered.`);
    }
  }

  console.debug(`[TurboMount Registration] Final registered names:`, Array.from(registeredNames));
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
    potentialIdentifiers.includes(identifier)
  );

  if (controllerDefinition) {
    console.debug(`[TurboMount Registration] Registering '${componentName}' with Stimulus controller '${controllerDefinition.identifier}'`);
    turboMount.register(
      plugin,
      componentName,
      component,
      controllerDefinition.controllerConstructor
    );
  } else {
    console.debug(`[TurboMount Registration] Registering '${componentName}' without a specific Stimulus controller.`);
    turboMount.register(plugin, componentName, component);
  }
};