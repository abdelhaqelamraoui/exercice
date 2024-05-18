import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
   host: "sandbox.smtp.mailtrap.io",
   port: 2525,
   auth: {
      user: "3e44a3a3de9173",
      pass: "6049fdbbfaf38d",
   },
});

const email = {
   from: "test-scolarite@noreply.ma",
   to: "yourfriend@email.com",
   subject: "Sending Email using Node.js",
   // text: "That was easy!",
   html: "<p>That was easy with this html format!</p>",
};

transporter.sendMail(email, function (error, info) {
   if (error) {
      console.log("Error:", error);
   } else {
      console.log("Email sent:", info.response);
   }
});
