import * as PoweredUP from "node-poweredup";
import keypress from "keypress";
import trains from "./trains";

keypress(process.stdin);

const setSpeed = (
  hub: any,
  speed: number,
  ms: number = 0,
  prevSpeed: number = 0
) => {
  console.log(`Changing speed from ${prevSpeed} to ${speed} in ${ms} ms`);
  return hub.rampMotorSpeed("A", prevSpeed, speed, ms);
};

const main = async () => {
  const poweredUP = new PoweredUP.PoweredUP();

  poweredUP.on("discover", async (hub: any) => {
    try {
      const train = trains(hub.uuid);

      if (!train) {
        return;
      }

      console.log(`Controlling train "${train.name}"`);

      await hub.connect();

      let speed: number = 0;

      process.stdin.on("keypress", async (ch: any, key: any) => {
        try {
          if (key.ctrl && key.name === "c") {
            process.exit();
          }

          const action = train.keys[key.name];

          if (!action) {
            return;
          }

          if (action.type === "depart") {
            console.log("Departing");
            await setSpeed(hub, 10, 1500, 0);
            await setSpeed(hub, action.speed, 5000, 10);
            speed = action.speed;
            return;
          }

          if (action.type === "arrive") {
            console.log("Arriving");
            await setSpeed(hub, 20, 2000, speed);
            await setSpeed(hub, 10, 2000, 20);
            await setSpeed(hub, 0, 500, 10);
            speed = 0;

            return;
          }

          if (action.type === "accelerate") {
            const prevSpeed = speed;

            speed += action.delta;

            console.log(`Changing speed from ${prevSpeed} to ${speed}`);
            await hub.rampMotorSpeed("A", prevSpeed, speed, 5000);

            return;
          }

          if (action.type === "set-speed") {
            speed = action.speed;

            await hub.setMotorSpeed("A", speed);

            return;
          }

          if (action.type === "set-colour") {
            await hub.setLEDRGB(action.red, action.green, action.blue);

            return;
          }

          return;
        } catch (err) {
          console.error(err);
        }
      });

      (process.stdin as any).setRawMode(true);
      process.stdin.resume();
    } catch (err) {
      console.error(err);
    }
  });

  poweredUP.scan(); // Start scanning for Hubs
};

main();
