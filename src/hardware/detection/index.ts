import { EventEmitter } from "events";
import Debug from "debug";
import { isRaspberryPi } from "../../utils";

const debug = Debug("detection");

const ONE_SECOND = 1000;
const MIN_DETECTION_INTERVAL = 1 * ONE_SECOND;

export interface ISensor {
  id: string;
  pin: number;
}

export interface IDetectionEvent {
  timestamp: number;
  id: string;
}

class Sensors extends EventEmitter {
  constructor(sensors: ISensor[]) {
    super();

    if (isRaspberryPi()) {
      import("pigpio").then(gpio => {
        this.initSensors(gpio, sensors);
      });
    }
  }

  private initSensors(gpio: any, sensors: ISensor[]) {
    sensors.map(sensor => this.initSensor(gpio, sensor));
  }

  private initSensor(gpio: any, sensor: ISensor) {
    debug(`Initialising sensor ${sensor.pin}/${sensor.id}`);

    const button = new gpio.Gpio(sensor.pin, {
      mode: gpio.Gpio.INPUT,
      pullUpDown: gpio.Gpio.PUD_DOWN,
      edge: gpio.Gpio.EITHER_EDGE
    });

    let lastDetected = 0;
    let timeout: NodeJS.Timer | null;

    const clearEmitter = () =>
      setTimeout(() => {
        debug(`Emitting clear event for ${sensor.id}`);
        this.emit("clear", { timestamp: Date.now(), id: sensor.id });
      }, 1000);

    button.on("interrupt", (level: boolean) => {
      const detected = !level;

      debug(`Detected event for ${sensor.id}, value=${level}`);

      if (!detected) {
        if (!timeout) {
          timeout = clearEmitter();
        }

        return;
      }

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

      // timeout = clearEmitter();
    });
  }
}

export default Sensors;
