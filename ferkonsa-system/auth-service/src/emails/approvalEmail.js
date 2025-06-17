const nodemailer = require("nodemailer");
require("dotenv").config();

const sendApprovalEmail = async (user, token) => {
  const approvalUrl = `${process.env.FRONT_URL}/auth/approve/${token}`;
  const html = `
    <h2>Solicitud de nuevo usuario</h2>
    <p>Nombre: ${user.nombre} ${user.apellido}</p>
    <p>Correo: ${user.correo}</p>
    <p>Rol: ${user.rol}</p>
    <a href="${approvalUrl}" style="padding:10px 20px;background:#ff0400;color:white;border-radius:5px;text-decoration:none;">Aprobar Usuario</a>
    <p>O usa este enlace si el botón no funciona:</p>
    <p>${approvalUrl}</p>
    <small>Se mostrará un mensaje directo, no se redirigirá a otra web.</small>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"FERKONSA" <${process.env.EMAIL_USER}>`,
    to: process.env.SUPERADMIN_EMAIL,
    subject: "Solicitud de nuevo usuario",
    html
  });
};

module.exports = sendApprovalEmail;

