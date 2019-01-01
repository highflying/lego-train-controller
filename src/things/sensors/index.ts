import Sensors, { IDetectionEvent, ISensor } from "../../hardware/detection";
import Debug from "debug";

const debug = Debug("sensors");

interface IDetectionCallback {
  (event: IDetectionEvent): void;
}

const registry = {
  detection: new Map<string, IDetectionCallback>(),
  clear: new Map<string, IDetectionCallback>()
};

const initSensors = (config: ISensor[]) => {
  const sensors = new Sensors(config);

  sensors.on("detection", (event: IDetectionEvent) => {
    debug(`${event.id} detected at ${event.timestamp}`);

    const callback = registry.detection.get(event.id);

    if (callback) {
      registry.detection.delete(event.id);
      callback(event);
    }
  });

  sensors.on("clear", (event: IDetectionEvent) => {
    debug(`${event.id} cleared at ${event.timestamp}`);

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

export default initSensors;
