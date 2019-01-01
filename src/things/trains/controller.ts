import Debug from "debug";
import { pause } from "../../utils";

const debug = Debug("controller");

export interface ITrain {
  uuid: string;
  name: string;
  maxSpeed?: number;
  minSpeed?: number;
}

export interface IController {
  uuid: string;
  name: string;
  status: () => string;
  emergencyStop: () => any;
  setSpeed: (speed: number, ms?: number) => any;
  getSpeed: () => number;
  setColour: (red: number, green: number, blue: number) => any;
  batteryLevel: () => number;
  rssi: () => number;
  current: () => number;
}

const controllerFactory = async (
  hub: any,
  train: ITrain
): Promise<IController> => {
  let prevSpeed = 0;
  let status: string = "stopped";
  const { maxSpeed = 100, minSpeed = -100 } = train;

  await hub.setName(train.name.slice(0, 14));

  const setSpeed = (speed: number, ms?: number) => {
    if (speed > maxSpeed) {
      speed = maxSpeed;
    } else if (speed < minSpeed) {
      speed = minSpeed;
    }

    if (speed === prevSpeed) {
      return;
    }

    const duration =
      ms !== undefined && ms !== null ? ms : Math.abs(speed - prevSpeed) * 50;

    debug(`Changing speed from ${prevSpeed} to ${speed} in ${duration} ms`);
    status = prevSpeed < speed ? "accelerating" : "decelerating";
    const result = hub.rampMotorSpeed("A", prevSpeed, speed, duration);

    prevSpeed = speed;

    return result.then(() => {
      status = speed ? "running" : "stopped";
    });
  };

  return {
    uuid: hub.uuid,
    name: train.name,
    status: () => status,
    emergencyStop: async () => {
      debug("Emergency Stop");
      await setSpeed(-20, 0);
      await pause((prevSpeed / 60) * 350);
      await setSpeed(0, 0);
    },
    setSpeed,
    setColour: hub.setLEDRGB.bind(hub),
    batteryLevel: () => hub.batteryLevel,
    rssi: () => hub.rssi,
    current: () => hub.current,
    getSpeed: () => prevSpeed
  };
};

export default controllerFactory;