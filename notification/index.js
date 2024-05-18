import express from "express";
import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const QUEUE_NAME = "notification_queue";

const app = express();
app.use(express.json());

const RMQ_SERVER_URL = `amqp://${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`;

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
   console.log(
      `Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}`
   );
});

async function consumeMessage() {
   try {
      const connection = await amqp.connect(RMQ_SERVER_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(QUEUE_NAME, { durable: false });

      console.log("Server is waiting for messages in the queue...");

      // the listner
      /**
       *  This method is used to assert the existence of a queue named queue.
       *  If the queue doesn't exist, it creates it. The second argument is
       *  an options object where durable: false specifies that the queue should
       * not be durable. Durable queues survive broker restarts, but in this case,
       *  the queue is marked as non-durable.
       */
      channel.consume(QUEUE_NAME, (msg) => {
         if (msg !== null) {
            console.log("Received message: ", msg.content.toString());
            channel.ack(msg);
         }
      });
   } catch (error) {
      console.error("Error consuming messages", error);
   }
}

consumeMessage();
