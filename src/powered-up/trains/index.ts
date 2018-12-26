import passenger from "./passenger";
export { ITrain, IAction } from "./interfaces";

const trains = [passenger];

export default (uuid: string) => {
  const train = trains.filter(train => train.uuid === uuid);

  return train[0];
};
