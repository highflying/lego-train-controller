import { ServerResponse, ServerRequest } from "microrouter";
import { send, createError } from "micro";
import { getFromRegistry } from "../powered-up/registry";
import { onDetection, onClear } from "../sensors";
import { switchPoint } from "../power-functions";
import Bluebird from "bluebird";
import { pause } from "../utils";

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
    await runActions([
      { type: "switchPoint", id: "siding", setting: "curved" },
      { type: "setSpeed", id: uuid, speed: -40 },
      { type: "onDetection", id: "platform1" },
      { type: "onClear", id: "platform1" },
      { type: "switchPoint", id: "siding", setting: "straight" },
      { type: "setSpeed", id: uuid, speed: 60 }
    ]);
  } else if (action === "stopPlatform3") {
    await runActions([
      { type: "onClear", id: "platform1" },
      { type: "switchPoint", id: "siding", setting: "curved" },
      { type: "setSpeed", id: uuid, speed: 60 },
      { type: "onDetection", id: "platform1" },
      { type: "setSpeed", id: uuid, speed: 40 },
      { type: "pause", ms: 1000 },
      { type: "setSpeed", id: uuid, speed: 30 },
      { type: "onClear", id: "platform1" },
      { type: "setSpeed", id: uuid, speed: 0 }
    ]);
  }

  return send(res, 200, {});
};

interface ISwitchPointAction {
  type: "switchPoint";
  id: string;
  setting: "straight" | "curved";
}

interface IDetectionAction {
  type: "onClear" | "onDetection";
  id: string;
}

interface ISetSpeedAction {
  type: "setSpeed";
  id: string;
  speed: number;
}

interface IPauseAction {
  type: "pause";
  ms: number;
}

type IAction =
  | ISwitchPointAction
  | IDetectionAction
  | ISetSpeedAction
  | IPauseAction;
type IActions = Array<IAction>;

const runActions = async (actions: IActions) =>
  Bluebird.each(actions, async action => {
    await runAction(action);
  });

const runAction = async (action: IAction) => {
  if (action.type === "onClear") {
    await new Promise(resolve => onClear(action.id, resolve));
  } else if (action.type === "onDetection") {
    await new Promise(resolve => onDetection(action.id, resolve));
  } else if (action.type === "setSpeed") {
    const train = getFromRegistry(action.id);
    if (train) {
      await train.setSpeed(action.speed);
    }
  } else if (action.type === "switchPoint") {
    await switchPoint(action.id, action.setting);
  } else if (action.type === "pause") {
    await pause(action.ms);
  }

  return;
};
