import { Plugin, TurboMount, TurboMountProps } from "turbo-mount";

import { TurboMountSvelteController } from "./turbo-mount-svelte-controller";

const plugin: Plugin = {
  framework: "svelte",
  controller: TurboMountSvelteController,
};

export class TurboMountSvelte<T> extends TurboMount<T> {
  constructor(props: Omit<TurboMountProps, "plugin">) {
    super({ ...props, plugin });
  }
}

export { TurboMountSvelte as TurboMount };
export default plugin;
