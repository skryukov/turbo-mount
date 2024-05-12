import { Plugin, TurboMount, TurboMountProps } from "turbo-mount";

import { TurboMountReactController } from "./turbo-mount-react-controller";

const plugin: Plugin = {
  framework: "react",
  controller: TurboMountReactController,
};

export class TurboMountReact<T> extends TurboMount<T> {
  constructor(props: Omit<TurboMountProps, "plugin">) {
    super({ ...props, plugin });
  }
}

export { TurboMountReact as TurboMount };

export default plugin;
