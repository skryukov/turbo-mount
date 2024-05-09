import {Plugin} from "turbo-mount";

import {TurboMountSvelteController} from "./turbo-mount-svelte-controller";

const plugin: Plugin = {
    framework: "svelte",
    controller: TurboMountSvelteController
}

export default plugin;
