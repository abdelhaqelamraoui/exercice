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
            channel.ack(msg);
            // TODO : according to the msg content, send the right mails
            const msgObj = JSON.parse(msg.content.toString());

            switch (msgObj.content) {
               case "inscription_effectuee":
                  const scolariteEmail = new ScolariteEmail(
                     msgObj.etudiant.email,
                     "Inscription effectuee",
                     `Mr/Mme <b> ${msgObj.etudiant.nom}</b><br/>Votre inscription est bien effectuee.`
                  );

                  scolariteEmail.send();
                  break;

               case "filiere fermee":
                  const scolariteEmail2 = new ScolariteEmail(
                     msgObj.etudiant.email,
                     "Filiere fermee",
                     `Mr/Mme <b> ${msgObj.etudiant.nom}</b><br/>La filiere demandee est fermee.`
                  );
                  scolariteEmail2.send();
                  break;

               case "max filiere atteint":
                  new ScolariteEmail(
                     "gestionnaire@jamiia.ma",
                     "Max de filiere atteint",
                     `La filiere <b> ${msgObj.filiere.nom}</b><br/> a atteint 100 inscris.`
                  ).send();
                  break;

               case "filiere ouverte":
                  new ScolariteEmail(
                     "gestionnaire@jamiia.ma",
                     "Ouverture filiere",
                     `La filiere <b> ${msgObj.filiere.nom}</b><br/> est ouverte.`
                  ).send();
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
