import Debug from "debug";
import { pause } from "../../utils";
import { IHub } from "../../hardware/powered-up";

const debug = Debug("controller");

type Connection = "A" | "B";

export interface ITrain {
  uuid: string;
  name: string;
  connection: Connection;
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
  voltage: () => number;
}

const controllerFactory = async (
  hub: IHub,
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

    if (speed > 0) {
      if (prevSpeed >= 0) {
        hub.setLightBrightness("B", 100);
      } else {
        setTimeout(() => hub.setLightBrightness("B", 100), duration / 2);
      }
    }

    debug(`Changing speed from ${prevSpeed} to ${speed} in ${duration} ms`);
    status = prevSpeed < speed ? "accelerating" : "decelerating";
    const result = hub.rampMotorSpeed(
      train.connection,
      prevSpeed,
      speed,
      duration
    );

    if (speed < 0) {
      setTimeout(() => hub.setLightBrightness("B", 0), duration / 2);
    }

    prevSpeed = speed;

    return result.then(() => {
      status = speed ? "running" : "stopped";
    });
  };

  const setColour = hub.setLEDRGB.bind(hub);

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
    setColour,
    batteryLevel: () => hub.batteryLevel,
    rssi: () => hub.rssi,
    current: () => hub.current,
    voltage: () => hub.voltage,
    getSpeed: () => prevSpeed
  };
};

export default controllerFactory;
