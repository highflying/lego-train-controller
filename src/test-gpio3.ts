import Sensors from "./detection";

const main = () => {
  const sensors = new Sensors();

  sensors.on(
    "detection",
    ({ timestamp, id }: { timestamp: number; id: string }) => {
      console.log(`${id} detected at ${timestamp}`);
    }
  );
};

main();
