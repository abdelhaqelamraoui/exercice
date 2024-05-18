import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// MAIL_MAILER=smtp
// # MAIL_HOST=smtp.gmail.com
// MAIL_HOST=sandbox.smtp.mailtrap.io
// MAIL_PORT=587
// MAIL_USERNAME=3e44a3a3de9173
// MAIL_PASSWORD=6049fdbbfaf38d
// MAIL_ENCRYPTION=tls
// MAIL_FROM_ADDRESS="laratest@gmail.com"
// MAIL_FROM_NAME="${APP_NAME}"

// Create a transporter object
const transporter = nodemailer.createTransport({
   host: process.env.EMAIL_HOST,
   port: process.env.EMAIL_PORT,
   // secure: process.env.EMAIL_SECURE, // use SSL
   auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
   },
});
// const transporter = nodemailer.createTransport({
//    host: "live.smtp.mailtrap.io",
//    port: 587,
//    secure: false, // use SSL
//    auth: {
//       user: "1a2b3c4d5e6f7g",
//       pass: "1a2b3c4d5e6f7g",
//    },
// });

export class Email {
   constructor(from, to, subject, text) {
      this.from = from;
      this.to = to;
      this.subject = subject;
      this.text = text;
      return this;
   }

   send() {
      const email = {
         from: this.from,
         to: this.to,
         subject: this.subject,
         text: this.text,
         // html: `<p>${this.text}</p>`, // using html instead of 'text' attribute
      };
      sendEmail(email);
      return this;
   }
}

export class ScolariteEmail extends Email {
   constructor(to, subject, text) {
      super(process.env.EMAIL_FROM_ADDRESS, to, subject, text);
      return this;
   }
}

export async function sendEmail(email) {
   // Configure the mailoptions object
   // const email = {
   //    from: "yourusername@email.com",
   //    to: "yourfriend@email.com",
   //    subject: "Sending Email using Node.js",
   //    text: "That was easy!",
   // };

   // Send the email
   transporter.sendMail(email, function (error, info) {
      if (error) {
         console.log("Error:", error);
      } else {
         console.log("Email sent:", info.response);
      }
   });
}
