import { IAction } from "./handleActions";

interface IParams {
  id: string;
  speed?: number;
}

const presets: {
  [index: string]: (params: IParams) => Array<IAction>;
} = {
  setSpeed: ({ id, speed = 0 }) => [{ type: "setSpeed", id, speed }],
  emergencyStop: ({ id }) => [{ type: "emergencyStop", id }],

  reverseIntoLoopAndGo: ({ id }) => [
    { type: "switchPoint", id: "siding", setting: "curved" },
    { type: "setSpeed", id, speed: -40 },
    { type: "onDetection", id: "platform1" },
    { type: "onClear", id: "platform1" },
    { type: "switchPoint", id: "siding", setting: "straight" },
    { type: "setSpeed", id, speed: 60 }
  ],

  stopInSiding: ({ id }) => [
    { type: "onClear", id: "platform1" },
    { type: "switchPoint", id: "siding", setting: "curved" },
    { type: "setSpeed", id, speed: 60 },
    { type: "onDetection", id: "platform1" },
    { type: "setSpeed", id, speed: 40 },
    { type: "onClear", id: "platform1" },
    { type: "setSpeed", id, speed: 0 }
  ]
};

export default presets;
