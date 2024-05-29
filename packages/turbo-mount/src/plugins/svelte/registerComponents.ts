import { buildRegisterComponentsFunction } from "turbo-mount/registerComponents";
import plugin from "turbo-mount/svelte";

const registerComponents = buildRegisterComponentsFunction(plugin);

export { registerComponents };
