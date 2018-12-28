const Gpio = require('pigpio').Gpio;
 
const button = new Gpio(2, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE
});
 
button.on('interrupt', (level) => {
	console.log(`${new Date().toISOString()} ${level}`);
});

