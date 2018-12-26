import passenger from "./passenger";

const trains = [passenger];

export default (uuid: string) => {
  const train = trains.filter(train => train.uuid === uuid);

  return train[0];
};
