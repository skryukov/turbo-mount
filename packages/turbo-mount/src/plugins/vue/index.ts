import {Plugin} from "turbo-mount";

import {TurboMountVueController} from "./turbo-mount-vue-controller";

const plugin: Plugin = {
    framework: "vue",
    controller: TurboMountVueController
}

export default plugin;
