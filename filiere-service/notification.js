import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const NOTIF_SERVER_URL = `amqp://${process.env.APP_HOST_NOTIFICATION_SERVICE}:${process.env.APP_PORT_NOTIFICATION_SERVICE}`;

const QUEUE_NAME = "notification_queue";

export async function sendMessage(message) {
   // the message now is an object instead of a string

   if (!message) {
      return { message: "Message is required" };
   }

   const strMsg = JSON.stringify(message);

   try {
      const connection = await amqp.connect(NOTIF_SERVER_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(QUEUE_NAME, { durable: false });

      channel.sendToQueue(QUEUE_NAME, Buffer.from(strMsg));
      console.log(`Sent message: ${JSON.stringify(message)}`);

      await channel.close();
      await connection.close();

      return { message: "Message sent successfully" };
   } catch (error) {
      console.error("Error sending message from etudiant service", error);
   }
}
