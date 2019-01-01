import { ServerResponse, ServerRequest } from "microrouter";
import { send, createError } from "micro";
import { getFromRegistry } from "../powered-up/registry";
import { onDetection, onClear } from "../sensors";
import { switchPoint } from "../power-functions";

// const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    await train.setSpeed(-40);
    await new Promise(resolve => onDetection("platform1", resolve));
    await new Promise(resolve => onClear("platform1", resolve));
    await switchPoint("siding", "curved");
    await train.setSpeed(40);
    await new Promise(resolve => onDetection("platform1", resolve));
    await new Promise(resolve => onClear("platform1", resolve));
    await train.setSpeed(0);
  } else if (action === "stopPlatform2") {
    await train.setSpeed(-40);
    await new Promise(resolve => onDetection("platform1", resolve));
    await new Promise(resolve => onClear("platform1", resolve));
    await switchPoint("siding", "straight");
    await train.setSpeed(60);
  } else if (action === "stopPlatform3") {
    await new Promise(resolve => onClear("platform1", resolve));
    await switchPoint("siding", "curved");
    await train.setSpeed(40);
    await new Promise(resolve => onDetection("platform1", resolve));
    await new Promise(resolve => onClear("platform1", resolve));
    await train.setSpeed(0);
  }

  return send(res, 200, {});
};
