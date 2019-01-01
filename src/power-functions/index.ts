import lirc_node from "lircv0.9.4_node";

lirc_node.init();

interface IPoint {
  id: string;
  channel: 1 | 2 | 3 | 4;
  connection: "A" | "B";
}

const points: Array<IPoint> = [
  {
    id: "siding",
    channel: 1,
    connection: "B"
  }
];

const remote = "LEGO_Single_Output";

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Direction = "straight" | "curved";
interface IPointFunc {
  (direction: Direction): Promise<void>;
}

const registry = new Map<string, IPointFunc>();

const setupPoint = (point: IPoint) => {
  const prefix = `${point.channel}${point.connection}_`;

  let state: Direction = "straight";

  const func = async (direction: Direction) => {
    if (direction === state) {
      return;
    }

    await changePoint(prefix, direction);
    state = direction;
  };

  registry.set(point.id, func);
};

const changePoint = async (
  prefix: string,
  direction: Direction
): Promise<void> => {
  const directionCode = direction === "straight" ? "M" : "";
  const code1 = `${prefix}${directionCode}6`;
  const code2 = `${prefix}0`;

  await sendCode(code1);
  await pause(50);
  await sendCode(code2);
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

const sendCode = (code: string) =>
  new Promise(resolve => lirc_node.irsend.send_once(remote, code, resolve));

const setup = () => points.forEach(setupPoint);

setup();
