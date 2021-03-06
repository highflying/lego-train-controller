import { ServerResponse, ServerRequest } from "microrouter";
import { send } from "micro";
import { getAllFromRegistry } from "../powered-up/registry";

export default async (req: ServerRequest, res: ServerResponse) => {
  console.log("getTrains");

  const list = getAllFromRegistry().map(train => ({
    uuid: train.uuid,
    name: train.name,
    speed: train.getSpeed()
  }));

  return send(res, 200, list);
};
