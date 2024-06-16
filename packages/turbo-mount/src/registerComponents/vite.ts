import { definitionsFromGlob } from "stimulus-vite-helpers";
import { Definition } from "@hotwired/stimulus";

import {
  TurboMount,
  Plugin,
  registerComponentsBase,
  ComponentModule,
} from "turbo-mount";

export type RegisterComponentsViteProps<T> = {
  plugin: Plugin<T>;
  turboMount: TurboMount;
  components: Record<string, ComponentModule>;
  controllers?: Record<string, Definition>;
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
    })),
    controllers: controllers ? definitionsFromGlob(controllers) : [],
  });
};
