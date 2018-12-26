import { SmartMoveRobot } from "@powered-up/api";
import { autorun } from "mobx";

const moveRobot = new SmartMoveRobot();

autorun(() => {
  console.log("a");
  const { encodedMotorA } = moveRobot;

  if (!encodedMotorA) {
    console.log("b");
    return;
  }
  console.log("c");

  if (!encodedMotorA.busy) {
    console.log("d");
    encodedMotorA.runWithSpeedForDuration(100, 1000);
  }
  console.log("e");
});
