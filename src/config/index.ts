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
      uuid: "90842b0a568f",
      name: "Passenger Train",
      maxSpeed: 80,
      minSpeed: -60
    }
  ]
};

export default config;
