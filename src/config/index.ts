import { IPointMotorConfig } from "../things/pointMotors";
import { ISensor } from "../hardware/detection";
import { ITrain } from "../things/trains";

interface IConfig {
  pointMotors: IPointMotorConfig[];
  sensors: ISensor[];
  trains: ITrain[];
}

const config: IConfig = {
  pointMotors: [
    {
      id: "siding",
      channel: 1,
      connection: "B"
    }
  ],
  sensors: [
    {
      id: "platform1",
      pin: 2
    },
    {
      id: "platform2",
      pin: 3
    }
  ],
  trains: [
    {
      uuid: "e9908e0653b0419ebe2455d3f7e7d9fa",
      name: "Passenger Train",
      connection: "A",
      maxSpeed: 80,
      minSpeed: -60
    }
  ]
};

export default config;
