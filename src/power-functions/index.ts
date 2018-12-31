import lirc_node from "lircv0.9.4_node";

lirc_node.init();

interface IPoint {
  id: string;
  channel: 1 | 2 | 3 | 4;
  connection: "A" | "B";
}

const points: { [index: string]: IPoint } = {
  siding: {
    id: "siding",
    channel: 1,
    connection: "B"
  }
};

const remote = "LEGO_Single_Output";

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const switchPoint = async (
  id: string,
  direction: "straight" | "curved"
) => {
  const point = points[id];
  const prefix = `${point.channel}${point.connection}_`;

  const directionCode = direction === "straight" ? "M" : "";
  const code1 = `${prefix}${directionCode}6`;
  const code2 = `${prefix}0`;

  await sendCode(code1);
  await pause(50);
  await sendCode(code2);
};

const sendCode = (code: string) =>
  new Promise(resolve => lirc_node.irsend.send_once(remote, code, resolve));
