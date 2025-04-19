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

const identifierNames = (name: string) => {
  const controllerName = camelToKebabCase(name)
    .replace(/_/g, "-")
    .replace(/\//g, "--");

  return [`turbo-mount--${controllerName}`, `turbo-mount-${controllerName}`];
};

export const registerComponentsBase = <T>({
  plugin,
  turboMount,
  components,
  controllers,
}: RegisterComponentsProps<T>) => {
  const controllerModules = controllers ?? [];

  for (const { module, filename } of components) {
    const name = filename
      .replace(/\.\w*$/, "")
      .replace(/^[./]*components\//, "");

    const identifiers = identifierNames(name);

    const controller = controllerModules.find(({ identifier }) =>
      identifiers.includes(identifier),
    );
    const component = module.default ?? module;

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
