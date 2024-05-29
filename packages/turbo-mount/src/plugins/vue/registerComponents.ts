import { buildRegisterComponentsFunction } from "turbo-mount/registerComponents";
import plugin from "turbo-mount/vue";

const registerComponents = buildRegisterComponentsFunction(plugin);

export { registerComponents };
