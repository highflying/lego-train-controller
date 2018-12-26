import serverStart from "./server";
import poweredUpStart from "./powered-up";

// keypress(process.stdin);

const main = async () => {
  await serverStart();
  await poweredUpStart();
};

main();
