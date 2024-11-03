import { buildRegisterComponentsFunction } from "turbo-mount/registerComponents";
import plugin from "turbo-mount/svelte4";

const registerComponents = buildRegisterComponentsFunction(plugin);

export { registerComponents };
