import { ServerResponse, ServerRequest } from "microrouter";
import { send } from "micro";
import { getAllTrains } from "../things/trains";

export default async (_req: ServerRequest, res: ServerResponse) => {
  const list = getAllTrains().map(train => ({
    uuid: train.uuid,
    name: train.name,
    speed: train.getSpeed()
  }));

  return send(res, 200, list);
};
