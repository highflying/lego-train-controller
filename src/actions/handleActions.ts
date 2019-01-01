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

// const actions: { [index: string]: (action: IAction) => Promise<any> } = {
const definedActions = {
  onClear: (action: IDetectionAction) =>
    new Promise(resolve => onClear(action.id, resolve)),

  onDetection: (action: IDetectionAction) =>
    new Promise(resolve => onDetection(action.id, resolve)),

  setSpeed: (action: ISetSpeedAction) => {
    const train = getTrain(action.id);
    if (!train) {
      return;
    }

    return train.setSpeed(action.speed);
  },

  switchPoint: (action: ISwitchPointAction) =>
    switchPoint(action.id, action.setting),

  pause: (action: IPauseAction) => pause(action.ms),

  emergencyStop: (action: IEmergencyStopAction) => {
    const train = getTrain(action.id);
    if (!train) {
      return;
    }

    return train.emergencyStop();
  }
};

export default async (actions: IActions) =>
  Bluebird.each(actions, action => runAction(action));

const runAction = (action: IAction) => {
  const func = definedActions[action.type] as (action: IAction) => Promise<any>;

  return func(action);
};
