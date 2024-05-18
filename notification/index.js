import express from "express";
import amqp from "amqplib";
import dotenv from "dotenv";
import { ScolariteEmail, sendEmail } from "./email.js";

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
            const msgContent = msg.content.toString();
            channel.ack(msg);
            // TODO : according to the msg content, send the right mails
            switch (msgContent) {
               case "inscription_effectuee":
                  // TODO : send a mail to the student
                  // const scolariteEmail = new ScolariteEmail(
                  //    "studentsmail@gmail.com",
                  //    "Inscription effecture",
                  //    "Votre inscription est bien effectuee"
                  // );
                  // scolariteEmail.send();

                  const email = {
                     from: "scolarite@jamiaa.ma",
                     to: "studentsmail@gmail.com",
                     subject: "Inscription effecture",
                     text: "Votre inscription est bien effectuee",
                  };
                  sendEmail(email);
                  break;

               default:
                  break;
            }
         }
      });
   } catch (error) {
      console.error("Error consuming messages", error);
   }
}

consumeMessage();
