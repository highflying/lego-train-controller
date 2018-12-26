// import { HubService } from "@powered-up/protocol";

const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();
var keypress = require("keypress");

poweredUP.on("discover", async (hub: any) => {
  try {
    if (hub.uuid === "e9908e0653b0419ebe2455d3f7e7d9fa") {
      console.log("Connected to correct hub");
    }

    // Wait to discover a Hub
    //   console.log(hub);
    console.log(hub.uuid);
    console.log("a");
    await hub.connect(); // Connect to the Hub
    console.log("b");
    //   await hub.sleep(3000); // Sleep for 3 seconds before starting

    console.log(hub.speed);
    // await hub.playTone(15000, 500);

    keypress(process.stdin);

    let speed: number = 0;

    process.stdin.on("keypress", async (ch: any, key: any) => {
      try {
        const prevSpeed = speed;
        console.log('got "keypress"', key);
        if (key.name === "left") {
          //   if (speed < 100) {
          speed = prevSpeed + 20;
          //   }
        } else if (key.name === "right") {
          if (speed > -100) {
            speed = prevSpeed - 20;
          }
        } else if (key.name === "space") {
          speed = 0;
        } else if (key.name === "r") {
          return hub.setLEDRGB(255, 0, 0);
        } else if (key.name === "g") {
          return hub.setLEDRGB(0, 255, 0);
        } else if (key.name === "b") {
          return hub.setLEDRGB(0, 0, 255);
        } else if (!key.ctrl && key.name === "c") {
          return hub.setLEDRGB(0, 255, 255);
        } else if (key.name === "y") {
          return hub.setLEDRGB(255, 255, 0);
        } else if (key.name === "e") {
          speed = 0;
          await hub.setMotorSpeed("A", -20); // Run a motor attached to port A for 2 seconds at maximum speed (100) then stop
          await hub.setMotorSpeed("A", 0); // Run a motor attached to port A for 2 seconds at maximum speed (100) then stop
          return;
          // return hub.rampMotorSpeed("A", prevSpeed, speed, 5000); // Run a motor attached to port A for 2 seconds at maximum speed (100) then stop
        } else if (key.ctrl && key.name === "c") {
          process.exit();
        } else {
          return;
        }

        // if (speed === 20) {
        if (speed !== prevSpeed) {
          console.log(`Changing speed from ${prevSpeed} to ${speed}`);
          return hub.rampMotorSpeed("A", prevSpeed, speed, 5000); // Run a motor attached to port A for 2 seconds at maximum speed (100) then stop
        }
        // } else {
        //   console.log(`Setting speed to ${speed}`);
        //   return hub.setMotorSpeed("A", speed); // Run a motor attached to port A for 2 seconds at maximum speed (100) then stop
        // }
      } catch (err) {
        console.error(err);
      }
    });

    (process.stdin as any).setRawMode(true);
    process.stdin.resume();

    // without this, we would only get streams once enter is pressed
    console.log("c");

    //   while (true) {
    //     console.log("d");
    //     // Repeat indefinitely
    //     // hub.setMotorSpeed("B", 75); // Start a motor attached to port B to run a 3/4 speed (75) indefinitely
    //     await hub.setMotorSpeed("A", 30, 2000); // Run a motor attached to port A for 2 seconds at maximum speed (100) then stop
    //     await hub.sleep(1000); // Do nothing for 1 second
    //     await hub.setMotorSpeed("A", -30, 1000); // Run a motor attached to port A for 1 second at 1/2 speed in reverse (-50) then stop
    //     await hub.sleep(1000); // Do nothing for 1 second
    //   }
  } catch (err) {
    console.error(err);
  }
});

poweredUP.scan(); // Start scanning for Hubs
