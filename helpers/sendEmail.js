import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_PASSWORD, UKR_NET_EMAIL} = process.env;
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

/* data = 
  to: "users@email.com",
  subject: "Test email",
  html: "<strong>Test Email</strong>",
*/
const sendEmail = async (data) => {
  const email = {...data, from: UKR_NET_EMAIL};
  await transport.sendMail(email)
    .then(() => console.log("Email send sucess"))
    .catch(error => console.log(error.message));
  
  return console.log(`Email to=${data.to} send sucess`);
}

export default sendEmail;