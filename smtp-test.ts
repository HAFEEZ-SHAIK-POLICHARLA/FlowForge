import nodemailer from "nodemailer";

async function main() {
  const transporter = nodemailer.createTransport({
    host: process.env.AP_SMTP_HOST,
    port: Number(process.env.AP_SMTP_PORT),
    secure: Number(process.env.AP_SMTP_PORT) === 465,
    auth: {
      user: process.env.AP_SMTP_USERNAME,
      pass: process.env.AP_SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
  });

  try {
    await transporter.verify();
    console.log("SMTP OK");
  } catch (e) {
    console.error(e);
  }
}

main();
