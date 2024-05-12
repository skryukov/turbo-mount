import { Plugin, TurboMount, TurboMountProps } from "turbo-mount";

import { TurboMountVueController } from "./turbo-mount-vue-controller";

const plugin: Plugin = {
  framework: "vue",
  controller: TurboMountVueController,
};

export class TurboMountVue<T> extends TurboMount<T> {
  constructor(props: Omit<TurboMountProps, "plugin">) {
    super({ ...props, plugin });
  }
}

export { TurboMountVue as TurboMount };

export default plugin;
