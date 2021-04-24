import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: 'qrrestaurant@mail.ru',
        pass: 'rest2021',
    },
    tls: {
        rejectUnauthorized: false
    },
});

export default transporter;
