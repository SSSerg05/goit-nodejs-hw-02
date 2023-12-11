import "dotenv/config";

const {BASE_URL} = process.env;

const verifyEmail = (email, verificationCode) => {
  const emailData = {
    to: email,
    subject: "Verify email",
    html: `<a 
      target="_blank" 
      href="${BASE_URL}/users/verify/${verificationCode}">
      Click verify email
      </a>`,
  }
  return emailData;
}

export default verifyEmail