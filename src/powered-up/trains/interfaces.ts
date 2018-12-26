interface IEmergencyStop {
  type: "emergency-stop";
}

interface IArrive {
  type: "arrive";
}

interface IDepart {
  type: "depart";
  speed: number;
}

interface IAccelerate {
  type: "accelerate";
  delta: number;
}

interface ISetSpeed {
  type: "set-speed";
  speed: number;
}

interface ISetColour {
  type: "set-colour";
  red: number;
  green: number;
  blue: number;
}

export type IAction =
  | IEmergencyStop
  | IArrive
  | IDepart
  | IAccelerate
  | ISetColour
  | ISetSpeed;

export interface ITrain {
  uuid: string;
  name: string;
  maxSpeed?: number;
  minSpeed?: number;
  keys: {
    [index: string]: IAction;
  };
}
