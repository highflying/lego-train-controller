import { getTrain } from "../things/trains";
import { onDetection, onClear } from "../things/sensors";
import { switchPoint } from "../things/pointMotors";
import Bluebird from "bluebird";
import { pause } from "../utils";

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

interface IEmergencyStopAction {
  type: "emergencyStop";
  id: string;
}

export type IAction =
  | ISwitchPointAction
  | IDetectionAction
  | ISetSpeedAction
  | IPauseAction
  | IEmergencyStopAction;
type IActions = Array<IAction>;

export default async (actions: IActions) =>
  Bluebird.each(actions, async action => {
    await runAction(action);
  });

const runAction = async (action: IAction) => {
  if (action.type === "onClear") {
    await new Promise(resolve => onClear(action.id, resolve));
  } else if (action.type === "onDetection") {
    await new Promise(resolve => onDetection(action.id, resolve));
  } else if (action.type === "setSpeed") {
    const train = getTrain(action.id);
    if (train) {
      await train.setSpeed(action.speed);
    }
  } else if (action.type === "switchPoint") {
    await switchPoint(action.id, action.setting);
  } else if (action.type === "pause") {
    await pause(action.ms);
  } else if (action.type === "emergencyStop") {
    const train = getTrain(action.id);
    if (train) {
      await train.emergencyStop();
    }
  }

  return;
};
