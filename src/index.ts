import serverStart from "./server";
import poweredUpStart from "./powered-up";
import { initSensors } from "./sensors";

const main = async () => {
  await serverStart();
  await poweredUpStart();

  initSensors();
};

main();
