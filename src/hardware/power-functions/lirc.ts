import lirc_node from "lircv0.9.4_node";

lirc_node.init();

const remote = "LEGO_Single_Output";

export const sendCode = (code: string) =>
  new Promise(resolve => lirc_node.irsend.send_once(remote, code, resolve));
