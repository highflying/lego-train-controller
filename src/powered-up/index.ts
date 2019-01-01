import * as PoweredUP from "node-poweredup";
import trains from "./trains";
import controllerFactory from "./controller";
import { addToRegistry } from "./registry";
import Debug from "debug";

const debug = Debug("poweredUp");

const start = async () => {
  const poweredUP = new PoweredUP.PoweredUP();

  poweredUP.on("discover", async (hub: any) => {
    try {
      const train = trains(hub.uuid);

      if (!train) {
        return;
      }

      debug(`Controlling train "${train.name}"`);

      await hub.connect();

      const controller = await controllerFactory(hub, train);

      addToRegistry(controller);
    } catch (err) {
      console.error(err);
    }
  });

  poweredUP.scan();
};

export default start;
