import {
  spikeMotor,
  Channel,
  Connection
} from "../../hardware/power-functions";

export interface IPointMotorConfig {
  id: string;
  channel: Channel;
  connection: Connection;
}

type Direction = "straight" | "curved";
interface IPointFunc {
  (direction: Direction): Promise<void>;
}

const registry = new Map<string, IPointFunc>();

const setupPoint = (point: IPointMotorConfig) => {
  let state: Direction = "straight";

  const func = async (direction: Direction) => {
    if (direction === state) {
      return;
    }

    await spikeMotor(
      point.channel,
      point.connection,
      direction === "straight" ? "reverse" : "forward"
    );
    state = direction;
  };

  registry.set(point.id, func);
};

export const switchPoint = async (
  id: string,
  direction: "straight" | "curved"
) => {
  const pointFunc = registry.get(id);

  if (!pointFunc) {
    return;
  }

  await pointFunc(direction);
};

const initPointMotors = (config: IPointMotorConfig[]) =>
  config.forEach(setupPoint);

export default initPointMotors;
