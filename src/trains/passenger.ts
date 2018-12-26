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

interface ITrain {
  uuid: string;
  name: string;
  keys: {
    [index: string]: IArrive | IDepart | IAccelerate | ISetColour | ISetSpeed;
  };
}

const train: ITrain = {
  uuid: "e9908e0653b0419ebe2455d3f7e7d9fa",
  name: "Passenger Train",
  keys: {
    d: {
      type: "depart",
      speed: 60
    },
    a: {
      type: "arrive"
    },
    left: {
      type: "accelerate",
      delta: 20
    },
    right: {
      type: "accelerate",
      delta: -20
    },
    space: {
      type: "set-speed",
      speed: 0
    },
    r: {
      type: "set-colour",
      red: 255,
      green: 0,
      blue: 0
    },
    g: {
      type: "set-colour",
      red: 0,
      green: 255,
      blue: 0
    },
    b: {
      type: "set-colour",
      red: 0,
      green: 0,
      blue: 255
    },
    y: {
      type: "set-colour",
      red: 255,
      green: 255,
      blue: 0
    },
    c: {
      type: "set-colour",
      red: 0,
      green: 255,
      blue: 255
    },
    e: {
      type: "set-speed",
      speed: 0
    }
  }
};

export default train;
