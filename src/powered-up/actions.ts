import { IAction } from "./trains";
import { IController } from "./controller";

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleAction = async (action: IAction, controller: IController) => {
  if (action.type === "emergency-stop") {
    console.log("Emergency Stop");

    const currentSpeed = controller.getSpeed();
    await controller.setSpeed(-20, 0);
    await pause((currentSpeed / 60) * 350);
    await controller.setSpeed(0, 0);
    return;
  }

  if (action.type === "depart") {
    console.log("Departing");
    if (controller.getSpeed() < 20) {
      await controller.setSpeed(20, 3000);
    }
    if (controller.getSpeed() < action.speed) {
      await controller.setSpeed(action.speed, 5000);
    }
    return;
  }

  if (action.type === "arrive") {
    console.log("Arriving");
    if (controller.getSpeed() > 20) {
      await controller.setSpeed(20, 2000);
    }
    if (controller.getSpeed() > 10) {
      await controller.setSpeed(10, 2000);
    }
    await controller.setSpeed(0, 500);

    return;
  }

  if (action.type === "accelerate") {
    const newSpeed = controller.getSpeed() + action.delta;

    await controller.setSpeed(newSpeed, 5000);

    return;
  }

  if (action.type === "set-speed") {
    await controller.setSpeed(action.speed);

    return;
  }

  if (action.type === "set-colour") {
    await controller.setColour(action.red, action.green, action.blue);

    return;
  }
};

export default handleAction;
