/// <reference types="vite/client" />

import { definitionsFromGlob } from "stimulus-vite-helpers";

import {
  TurboMount,
  Plugin,
  registerComponentsBase,
  ComponentDefinition,
} from "turbo-mount";

export type RegisterComponentsViteProps<T> = {
  plugin: Plugin<T>;
  turboMount: TurboMount;
  components: ReturnType<ImportMeta["glob"]>;
  controllers?: ReturnType<ImportMeta["glob"]>;
};

export const registerComponents = <T>({
  plugin,
  turboMount,
  components,
  controllers,
}: RegisterComponentsViteProps<T>) => {
  return registerComponentsBase({
    plugin,
    turboMount,
    components: Object.entries(components).map(([filename, module]) => ({
      filename,
      module,
    })) as ComponentDefinition[],
    controllers: controllers ? definitionsFromGlob(controllers) : [],
  });
};
