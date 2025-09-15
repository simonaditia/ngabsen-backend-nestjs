const amqp = require('amqplib');
class RabbitMQConsumer {
  constructor(logService) {
    this.logService = logService;
  }
  async start() {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    const queue = 'employee_logs';
    await channel.assertQueue(queue, { durable: false });
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const log = JSON.parse(msg.content.toString());
        await this.logService.createLog(
          log.employeeId,
          log.action,
          log.details
        );
        channel.ack(msg);
      }
    });
    console.log('RabbitMQ log consumer started.');
  }
}
module.exports = { RabbitMQConsumer };
