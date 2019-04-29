export const pause = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const isRaspberryPi = () => process.env.TERM_PROGRAM !== "vscode";
