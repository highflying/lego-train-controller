import { IController } from "./controller";

const registry = new Map<string, IController>();

export const addToRegistry = (controller: IController) =>
  registry.set(controller.uuid, controller);

export const getFromRegistry = (uuid: string) => registry.get(uuid);

export const getAllFromRegistry = () => Array.from(registry.values());
