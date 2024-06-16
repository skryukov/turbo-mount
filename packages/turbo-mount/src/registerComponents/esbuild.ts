import {
  registerComponentsBase,
  Plugin,
  TurboMount,
  ComponentModule,
} from "turbo-mount";

export type EsbuildRailsDefinition = {
  name: string;
  module: ComponentModule;
  filename: string;
};

export type RegisterComponentsEsbuildProps<T> = {
  plugin: Plugin<T>;
  turboMount: TurboMount;
  components: EsbuildRailsDefinition[];
  controllers?: EsbuildRailsDefinition[];
};

const registerComponents = <T>({
  plugin,
  turboMount,
  components,
  controllers,
}: RegisterComponentsEsbuildProps<T>) => {
  const mappedControllers = controllers
    ? controllers.map((controller) => {
        return {
          identifier: controller.name,
          controllerConstructor:
            controller.module?.default || controller.module,
        };
      })
    : [];

  return registerComponentsBase({
    plugin,
    turboMount,
    components,
    controllers: mappedControllers,
  });
};

export { registerComponents };
