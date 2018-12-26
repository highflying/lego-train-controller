import { ITrain } from "./trains";

export interface IController {
  uuid: string;
  name: string;
  emergencyStop: () => any;
  setSpeed: (speed: number, ms?: number) => any;
  getSpeed: () => number;
  setColour: (red: number, green: number, blue: number) => any;
  stats: () => void;
}

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const controllerFactory = async (
  hub: any,
  train: ITrain
): Promise<IController> => {
  let prevSpeed = 0;
  const { maxSpeed = 100, minSpeed = -100 } = train;

  await hub.setName(train.name.slice(0, 14));

  const setSpeed = (speed: number, ms: number = 0) => {
    if (speed > maxSpeed) {
      speed = maxSpeed;
    } else if (speed < minSpeed) {
      speed = minSpeed;
    }

    if (speed === prevSpeed) {
      return;
    }

    console.log(`Changing speed from ${prevSpeed} to ${speed} in ${ms} ms`);
    const result = hub.rampMotorSpeed("A", prevSpeed, speed, ms);

    prevSpeed = speed;

    return result;
  };

  return {
    uuid: hub.uuid,
    name: train.name,
    emergencyStop: async () => {
      await setSpeed(-20, 0);
      await pause((prevSpeed / 60) * 350);
      await setSpeed(0, 0);
    },
    setSpeed,
    setColour: hub.setLEDRGB.bind(hub),
    stats: () => {
      console.log(`Hub name ${hub.name}`);
      console.log(`Battery level ${hub.batteryLevel}`);
      console.log(`Signal strength ${hub.rssi}`);
      console.log(`Current ${hub.current}`);
    },
    getSpeed: () => prevSpeed
  };
};

export default controllerFactory;
