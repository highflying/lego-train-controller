import { Gpio } from "pigpio";
import { EventEmitter } from "events";
import Debug from "debug";

const debug = Debug("detection");

const ONE_SECOND = 1000;
const MIN_DETECTION_INTERVAL = 1 * ONE_SECOND;

interface ISensor {
  id: string;
  pin: number;
}

const sensors: ISensor[] = [
  {
    id: "platform1",
    pin: 2
  },
  {
    id: "platform2",
    pin: 3
  }
];

export interface IDetectionEvent {
  timestamp: number;
  id: string;
}

class Sensors extends EventEmitter {
  constructor() {
    super();

    this.initSensors();
  }

  private initSensors() {
    sensors.map(sensor => this.initSensor(sensor));
  }

  private initSensor(sensor: ISensor) {
    debug(`Initialising sensor ${sensor.pin}/${sensor.id}`);

    const button = new Gpio(sensor.pin, {
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_DOWN,
      edge: Gpio.EITHER_EDGE
    });

    let lastDetected = 0;
    let timeout: NodeJS.Timer | null;

    button.on("interrupt", (level: boolean) => {
      const detected = !level;

      debug(`Detected event for ${sensor.id}, value=${level}`);

      if (detected) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        const timestamp = Date.now();

        if (timestamp - lastDetected >= MIN_DETECTION_INTERVAL) {
          const event: IDetectionEvent = { timestamp, id: sensor.id };
          this.emit("detection", event);

          debug(`Emitting detection event for ${sensor.id}`);
        } else {
          debug(`Previous detection was too recent for ${sensor.id}`);
        }

        lastDetected = timestamp;

        timeout = setTimeout(() => {
          debug(`Emitting clear event for ${sensor.id}`);
          this.emit("clear", { timestamp: Date.now(), id: sensor.id });
        }, 750);
      }
    });
  }
}

export default Sensors;
