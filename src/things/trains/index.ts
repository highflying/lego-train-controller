import PoweredUp from "../../hardware/powered-up";

import controllerFactory, { ITrain, IController } from "./controller";
import Debug from "debug";

export { ITrain };

const debug = Debug("poweredUp");
const registry = new Map<string, IController>();

const initTrains = async (config: ITrain[]) => {
  const uuids = config.map(train => train.uuid);

  const poweredUp = new PoweredUp(uuids);
  poweredUp.on("hubConnected", async (hub: any) => {
    try {
      const train = config.find(train => train.uuid === hub.uuid);

      if (!train) {
        return;
      }

      debug(`Controlling train "${train.name}"`);

      const controller = await controllerFactory(hub, train);

      registry.set(controller.uuid, controller);
    } catch (err) {
      console.error(err);
    }
  });
};

export const getTrain = (uuid: string) => registry.get(uuid);
export const getAllTrains = () => Array.from(registry.values());

export default initTrains;
