import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import * as admin from 'firebase-admin';
import { Kafka } from 'kafkajs';
import { join } from 'path';

@Injectable()
export class NotificationService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(join(process.cwd(), 'serviceAccountKey.json')),
      });
    }
  }

  async sendFirebaseNotification(title: string, body: string, deviceToken: string) {
    try {
      await admin.messaging().send({
        notification: { title, body },
        token: deviceToken,
      });
      console.log(`[Firebase] Sent to: ${deviceToken}, Title: ${title}, Body: ${body}`);
      return true;
    } catch (error) {
      console.error('[Firebase] Error:', error);
      return false;
    }
  }

  // RabbitMQ logging
  async sendRabbitLog(log: any) {
    try {
      const conn = await amqp.connect('amqp://localhost');
      const channel = await conn.createChannel();
      const queue = 'employee_logs';
      await channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(log)));
      setTimeout(() => { conn.close(); }, 500);
      return true;
    } catch (err) {
      console.error('RabbitMQ error:', err);
      return false;
    }
  }

  // Kafka logging
  async sendKafkaLog(log: any) {
    try {
      const kafka = new Kafka({ brokers: ['localhost:9092'] });
      const producer = kafka.producer();
      await producer.connect();
      await producer.send({
        topic: 'employee_logs',
        messages: [{ value: JSON.stringify(log) }],
      });
      await producer.disconnect();
      return true;
    } catch (err) {
      console.error('Kafka error:', err);
      return false;
    }
  }
};
