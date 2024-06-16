import { Plugin } from "turbo-mount";

import {
  registerComponents,
  RegisterComponentsViteProps,
} from "./registerComponents/vite";

export const buildRegisterComponentsFunction = <T>(plugin: Plugin<T>) => {
  return (props: Omit<RegisterComponentsViteProps<T>, "plugin">) =>
    registerComponents({ plugin, ...props });
};
