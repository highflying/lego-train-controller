import { ServerResponse, ServerRequest } from "microrouter";
import { send, createError } from "micro";
import { getFromRegistry } from "../powered-up/registry";
import { onDetection, onClear } from "../sensors";
import { switchPoint } from "../power-functions";

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
    console.log("Reversing");
    await train.setSpeed(-30);
    console.log("Detecting");
    await new Promise(resolve => onDetection("platform1", () => resolve));
    console.log("Waiting for clear");
    await new Promise(resolve => onClear("platform1", () => resolve));
    console.log("Switching Point");
    await switchPoint("siding", "curved");
    console.log("Going forward");
    await train.setSpeed(30);
    console.log("Detecting");
    await new Promise(resolve => onDetection("platform1", () => resolve));
    console.log("Waiting for clear");
    await new Promise(resolve => onClear("platform1", () => resolve));
    console.log("Stopping");
    await train.setSpeed(0);

    // onDetection("platform1", event => {
    //   console.log(event);
    //   train.setSpeed(0);
    //   // await train.setSpeed(-30);
    // });
  } else if (action === "stopPlatform2") {
    onDetection("platform2", async event => {
      console.log(event);
      const currentSpeed = train.getSpeed();
      await train.setSpeed(-1 * currentSpeed);
      // await train.setSpeed(0);
      await pause(5000);
      await train.setSpeed(currentSpeed);
    });
  }

  return send(res, 200, {});
};
