import { ServerResponse, ServerRequest } from "microrouter";
import { send, createError } from "micro";
import { getFromRegistry } from "../powered-up/registry";

export default async (req: ServerRequest, res: ServerResponse) => {
  console.log("getTrain");

  const { uuid } = req.params;

  const train = getFromRegistry(uuid);

  if (!train) {
    throw createError(404, "Train not found");
  }

  const stats = {
    uuid: train.uuid,
    name: train.name,
    speed: train.getSpeed()
  };

  return send(res, 200, stats);
};
