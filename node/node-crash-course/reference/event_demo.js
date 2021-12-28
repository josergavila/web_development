const EventEmiiter = require('events');

class MyEmitter extends EventEmiiter {  }

const myEmiiter = new MyEmitter();

myEmiiter.on('event', () => console.log('Event Fired!'));

myEmiiter.emit('event');
