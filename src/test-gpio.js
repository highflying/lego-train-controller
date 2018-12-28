var gpio = require('rpi-gpio');

const pin = 3;

gpio.on('change', function(channel, value) {
  console.log('Channel ' + channel + ' value is now ' + value);
});

const handleExit = () => {
  console.log('Process exitting');
  gpio.destroy(() => console.log('destroyed'));
};

process.on('exit', handleExit);
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

gpio.setup(pin, gpio.DIR_IN, gpio.EDGE_BOTH);
