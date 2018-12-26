import { router, get, put } from "microrouter";
import getTrain from "./getTrain";
import getTrains from "./getTrains";
import putSpeed from "./putSpeed";

export default router(
  put("/v1/train/:uuid", putSpeed),
  get("/v1/train/:uuid", getTrain),
  get("/v1/train", getTrains)
);
