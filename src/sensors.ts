import Sensors, { IDetectionEvent } from "./detection";

interface IDetectionCallback {
  (event: IDetectionEvent): void;
}

const registry = {
  detection: new Map<string, IDetectionCallback>(),
  clear: new Map<string, IDetectionCallback>()
};

export const initSensors = () => {
  const sensors = new Sensors();

  sensors.on("detection", (event: IDetectionEvent) => {
    console.log(`${event.id} detected at ${event.timestamp}`);

    const callback = registry.detection.get(event.id);

    if (callback) {
      registry.detection.delete(event.id);
      callback(event);
    }
  });

  sensors.on("clear", (event: IDetectionEvent) => {
    console.log(`${event.id} detected at ${event.timestamp}`);

    const callback = registry.clear.get(event.id);

    if (callback) {
      registry.clear.delete(event.id);
      callback(event);
    }
  });
};

export const onDetection = (id: string, callback: IDetectionCallback) =>
  registry.detection.set(id, callback);

export const onClear = (id: string, callback: IDetectionCallback) =>
  registry.clear.set(id, callback);
