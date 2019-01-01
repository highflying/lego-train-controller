import { PoweredUP, PUPHub as IHub } from "node-poweredup";
import Debug from "debug";
import { EventEmitter } from "events";

const debug = Debug("poweredUp");

export { IHub };

export default class PoweredUp extends EventEmitter {
  private uuids: string[];

  constructor(uuids: string[]) {
    super();

    this.uuids = uuids;

    const poweredUP = new PoweredUP();

    poweredUP.on("discover", async (hub: IHub) => {
      try {
        const index = this.uuids.findIndex(uuid => uuid === hub.uuid);

        if (index === -1) {
          return;
        }

        debug(`Controlling train "${hub.uuid}"`);

        await hub.connect();

        this.emit("hubConnected", hub);
      } catch (err) {
        console.error(err);
      }
    });

    poweredUP.scan();
  }
}
