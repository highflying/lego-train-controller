import { ServerResponse, ServerRequest } from "microrouter";
import { send, createError } from "micro";
import { getFromRegistry } from "../powered-up/registry";
import { onDetection } from "../sensors";

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async (req: ServerRequest, res: ServerResponse) => {
  const { uuid } = req.params;
  const { speed, emergencyStop = 0, action } = req.query;

  const train = getFromRegistry(uuid);

  if (!train) {
    throw createError(404, "Train not found");
  }

  if (speed) {
    const speedValue = parseInt(speed, 10);

    train.setSpeed(speedValue);
  } else if (emergencyStop === "1") {
    train.emergencyStop();
  } else if (action === "stopPlatform1") {
    onDetection("platform1", event => {
      console.log(event);
      train.setSpeed(0);
    });
  } else if (action === "stopPlatform2") {
    onDetection("platform2", async event => {
      console.log(event);
      const currentSpeed = train.getSpeed();
      await train.setSpeed(0);
      await pause(5000);
      await train.setSpeed(currentSpeed);
    });
  }

  return send(res, 200, {});
};
