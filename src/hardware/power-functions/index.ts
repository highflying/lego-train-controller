import { pause } from "../../utils";
import { sendCode } from "./lirc";

export type Channel = 1 | 2 | 3 | 4;

export type Connection = "A" | "B";

type Direction = "forward" | "reverse";

export const spikeMotor = async (
  channel: Channel,
  connection: Connection,
  direction: Direction
): Promise<void> => {
  const prefix = `${channel}${connection}_`;
  const directionCode = direction === "forward" ? "" : "M";
  const code1 = `${prefix}${directionCode}6`;
  const code2 = `${prefix}0`;

  await sendCode(code1);
  await pause(50);
  await sendCode(code2);
};
