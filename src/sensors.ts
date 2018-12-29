import Sensors, { IDetectionEvent } from "./detection";

interface IDetectionCallback {
  (event: IDetectionEvent): void;
}

const registry = new Map<string, IDetectionCallback>();

export const initSensors = () => {
  const sensors = new Sensors();

  sensors.on("detection", (event: IDetectionEvent) => {
    console.log(`${event.id} detected at ${event.timestamp}`);

    const callback = registry.get(event.id);

    if (callback) {
      registry.delete(event.id);
      callback(event);
    }
  });
};

export const onDetection = (id: string, callback: IDetectionCallback) =>
  registry.set(id, callback);
