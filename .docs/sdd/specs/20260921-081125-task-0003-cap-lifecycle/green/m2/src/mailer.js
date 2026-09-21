import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST ?? 'localhost', port: 1025 });

export function sendMail(to, subject, text) {
  return transport.sendMail({ from: 'aulario@academia.test', to, subject, text });
}
