import serverStart from "./server";
import initTrains from "./things/trains";
import initSensors from "./things/sensors";
import initPointMotors from "./things/pointMotors";
import config from "./config";

const main = () =>
  Promise.all([
    serverStart(),
    initTrains(config.trains),
    initPointMotors(config.pointMotors),
    initSensors(config.sensors)
  ]);

main();
