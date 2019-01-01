import { router, get, put } from "microrouter";
import getTrain from "./getTrain";
import getTrains from "./getTrains";
import putTrain from "./putTrain";
const cors = require("micro-cors")();

export default cors(
  router(
    put("/v1/train/:uuid", putTrain),
    get("/v1/train/:uuid", getTrain),
    get("/v1/train", getTrains)
  )
);
