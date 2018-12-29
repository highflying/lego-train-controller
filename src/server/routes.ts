import { router, get, put } from "microrouter";
import getTrain from "./getTrain";
import getTrains from "./getTrains";
import putSpeed from "./putSpeed";
const cors = require("micro-cors")();

export default cors(
  router(
    put("/v1/train/:uuid", putSpeed),
    get("/v1/train/:uuid", getTrain),
    get("/v1/train", getTrains)
  )
);
