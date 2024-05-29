import { buildRegisterComponentsFunction } from "turbo-mount/registerComponents";
import plugin from "turbo-mount/react";

const registerComponents = buildRegisterComponentsFunction(plugin);

export { registerComponents };
