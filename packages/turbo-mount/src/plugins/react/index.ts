import { Plugin } from "turbo-mount";

import { TurboMountReactController } from "./turbo-mount-react-controller";

const plugin: Plugin = {
  framework: "react",
  controller: TurboMountReactController,
};

export default plugin;
