import micro from "micro";
import routes from "./routes";

const server = micro(routes);

const start = () => {
  server.listen(4000, () => console.log("Listening on port 4000"));

  console.log("API/Websocket started");
};

export default start;
