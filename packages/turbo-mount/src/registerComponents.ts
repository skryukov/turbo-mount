import { definitionsFromGlob } from "stimulus-vite-helpers";
import { Definition } from "@hotwired/stimulus";

import { TurboMount, Plugin } from "turbo-mount";

import { camelToKebabCase } from "./helpers";

type ComponentModule = { default: never } | never;

type RegisterComponentsProps<T> = {
  plugin: Plugin<T>;
  turboMount: TurboMount;
  components: Record<string, ComponentModule>;
  controllers?: Record<string, Definition>;
};

const identifierNames = (name: string) => {
  const controllerName = camelToKebabCase(name);

  return [`turbo-mount--${controllerName}`, `turbo-mount-${controllerName}`];
};

export const registerComponents = <T>({
  plugin,
  turboMount,
  components,
  controllers,
}: RegisterComponentsProps<T>) => {
  const controllerModules = controllers ? definitionsFromGlob(controllers) : [];

  for (const [componentPath, componentModule] of Object.entries(components)) {
    const name = componentPath
      .replace(/\.\w*$/, "")
      .replace(/^[./]*components\//, "");

    const identifiers = identifierNames(name);

    const controller = controllerModules.find(({ identifier }) =>
      identifiers.includes(identifier),
    );
    const component = componentModule.default ?? componentModule;

    if (controller) {
      turboMount.register(
        plugin,
        name,
        component,
        controller.controllerConstructor,
      );
    } else {
      turboMount.register(plugin, name, component);
    }
  }
};

export const buildRegisterComponentsFunction = <T>(plugin: Plugin<T>) => {
  return (props: Omit<RegisterComponentsProps<T>, "plugin">) =>
    registerComponents({ plugin, ...props });
};
