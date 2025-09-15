const { LogService } = require('./log.service');
const { RabbitMQConsumer } = require('./rabbitmq.consumer');

async function bootstrap() {
  const logService = new LogService();
  const consumer = new RabbitMQConsumer(logService);
  await consumer.start();
}

bootstrap();
