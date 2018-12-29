import { ITrain } from "./interfaces";

const train: ITrain = {
  uuid: "90842b0a568f",
  name: "Passenger Train",
  maxSpeed: 80,
  minSpeed: -60,
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
    m: {
      type: "set-speed",
      speed: 6666
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
      type: "emergency-stop"
    }
  }
};

export default train;
