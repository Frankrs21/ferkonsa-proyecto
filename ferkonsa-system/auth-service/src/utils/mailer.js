const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendApprovalEmail = async (adminEmail, usuarioId) => {
  const url = `http://localhost:3000/api/user/approve/${usuarioId}`;

  const mailOptions = {
    from: `"FERKONSA" <${process.env.EMAIL_SENDER}>`,
    to: adminEmail,
    subject: "Nuevo usuario pendiente de aprobación",
    html: `
      <p>Un nuevo usuario se ha registrado.</p>
      <p>Para aprobarlo, haz clic aquí:</p>
      <a href="${url}">${url}</a>
    `
  };

  console.log("📧 Enviando correo a:", adminEmail);
  console.log("🔗 Enlace de aprobación:", url);

  await transporter.sendMail(mailOptions)
    .then(() => console.log("✅ Correo enviado"))
    .catch((err) => console.error("❌ Error al enviar correo:", err));
};

const sendRecoveryEmail = (correo, token) => {
  const url = `http://localhost:3000/api/auth/restablecer/${token}`;
  const html = `
    <p>Has solicitado recuperar tu contraseña.</p>
    <p>Haz clic aquí para restablecerla (válido por 15 minutos):</p>
    <a href="${url}">${url}</a>
  `;
  return transporter.sendMail({
    from: `"FERKONSA" <${process.env.EMAIL_SENDER}>`,
    to: correo,
    subject: "Recuperación de contraseña",
    html
  });
};

module.exports = { sendApprovalEmail, sendRecoveryEmail };

