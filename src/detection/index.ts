import { Gpio } from "pigpio";
import { EventEmitter } from "events";

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

    button.on("interrupt", (level: boolean) => {
      const event: IDetectionEvent = { timestamp: Date.now(), id: sensor.id };
      this.emit("detection", event);
      console.log(`${new Date().toISOString()} ${level}`);
    });
  }
}

export default Sensors;
