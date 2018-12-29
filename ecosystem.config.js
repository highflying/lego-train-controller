module.exports = {
  apps: [
    {
      name: "TrainController",
      script: "./dist/index.js",
      instances: 1,
      max_restarts: 1000,
      source_map_support: false,
      watch: false
    }
  ]
};
