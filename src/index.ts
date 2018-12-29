import serverStart from "./server";
import poweredUpStart from "./powered-up";
import { initSensors } from "./sensors";

// keypress(process.stdin);

const main = async () => {
  await serverStart();
  await poweredUpStart();

  initSensors();
};

main();
