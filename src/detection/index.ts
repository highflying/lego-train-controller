import { Gpio } from "pigpio";
import { EventEmitter } from "events";

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
    const button = new Gpio(sensor.pin, {
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_DOWN,
      edge: Gpio.EITHER_EDGE
    });

    let lastDetected = 0;
    button.on("interrupt", (level: boolean) => {
      const detected = !level;

      if (detected) {
        const timestamp = Date.now();

        if (timestamp - lastDetected >= MIN_DETECTION_INTERVAL) {
          const event: IDetectionEvent = { timestamp, id: sensor.id };
          this.emit("detection", event);
          console.log(`${new Date().toISOString()} ${level}`);
        }

        lastDetected = timestamp;
      }
    });
  }
}

export default Sensors;
