import nodemailer from "nodemailer";
import "dotenv/config";

import HttpError from "./HttpError";

const {UKR_NET_PASSWORD, UKR_NET_EMAIL, UKR_NET_SMTP_ADDRESS} = process.env;
const nodemailerConfig = {
  host: UKR_NET_SMTP_ADDRESS,
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

  await transport.sendMail(email)
    .then(() => console.log(`Email to=${data.to} send sucess`))
    .catch(error => {
      console.log(`Wrong send email. ${error.message}`)
      throw HttpError(404, "Wrong send email")
    });
}

export default sendEmail;