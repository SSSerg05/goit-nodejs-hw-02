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

const sendEmail = async (data) => {
  const email = {...data, from: UKR_NET_EMAIL};
  console.log(email);

  await transport.sendMail(email)
    .then(() => console.log(`Email to=${data.to} send sucess`))
    .catch(error => console.log(`Wrong send email. ${error.message}`));
}

export default sendEmail;