const EventEmiiter = require('events');
const uuid = require('uuid');

class Logger extends EventEmiiter {
    log(msg) {
        this.emit('message', { id: uuid.v4(), msg });
    }
}

const logger = new Logger();

logger.on('message', (data) => console.log('Called Listener', data));

logger.log('Hello World');
logger.log('io');

module.exports = Logger;
