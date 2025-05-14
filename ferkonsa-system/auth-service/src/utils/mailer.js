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

module.exports = { sendApprovalEmail };

