import * as PoweredUP from "node-poweredup";
// import keypress from "keypress";
import trains from "./trains";
import handleAction from "./actions";
import controllerFactory, { IController } from "./controller";
import { addToRegistry } from "./registry";

// keypress(process.stdin);

const start = async () => {
  const poweredUP = new PoweredUP.PoweredUP();

  poweredUP.on("discover", async (hub: any) => {
    try {
      const train = trains(hub.uuid);

      if (!train) {
        return;
      }

      console.log(`Controlling train "${train.name}"`);

      await hub.connect();

      const controller = await controllerFactory(hub, train);

      addToRegistry(controller);

      // process.stdin.on("keypress", async (_ch: any, key: any) => {
      //   try {
      //     if (!key) {
      //       return;
      //     }

      //     if (key.ctrl && key.name === "c") {
      //       process.exit();
      //     }

      //     const action = train.keys[key.name];

      //     if (!action) {
      //       return;
      //     }

      //     controller.stats();

      //     await handleAction(action, controller);

      //     return;
      //   } catch (err) {
      //     console.error(err);
      //   }
      // });

      // (process.stdin as any).setRawMode(true);
      // process.stdin.resume();
    } catch (err) {
      console.error(err);
    }
  });

  poweredUP.scan(); // Start scanning for Hubs
};

export default start;
