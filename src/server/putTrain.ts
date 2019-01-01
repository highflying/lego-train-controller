import { ServerResponse, ServerRequest } from "microrouter";
import { send, createError } from "micro";
import { getTrain } from "../things/trains";
import handleActions from "../actions/handleActions";
import presets from "../actions/presets";

export default async (req: ServerRequest, res: ServerResponse) => {
  const { uuid } = req.params;
  const { action, speedStr } = req.query;

  const train = getTrain(uuid);

  if (!train) {
    throw createError(404, "Train not found");
  }

  const params = {
    id: train.uuid,
    action,
    speed: parseInt(speedStr, 10) || undefined
  };

  const actions = getActions(params);

  if (actions) {
    await handleActions(actions);
  }

  return send(res, 200, {});
};

interface IParams {
  id: string;
  action: string;
  speed?: number;
}

const getActions = (params: IParams) => {
  const preset = presets[params.action];

  if (!preset) {
    return;
  }

  return preset(params);
};
