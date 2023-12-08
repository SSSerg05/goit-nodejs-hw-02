import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_PASSWORD, UKR_NET_EMAIL} = process.env;

/* data = 
  to: "users@email.com",
  subject: "Test email",
  html: "<strong>Test Email</strong>",
*/
const sendEmail = async (data) => {
  const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
      user: UKR_NET_EMAIL,
      pass: UKR_NET_PASSWORD,
    }
  }

  const transport = nodemailer.createTransport(nodemailerConfig);

  const email = {...data, from: UKR_NET_EMAIL};
  await transport.sendMail(email);
  
  return console.log("Email send sucess");
}

export default sendEmail;