const nodemailer = require('nodemailer');

const sendApprovalEmail = async (usuario, token) => {
  const approvalUrl = `${process.env.APPROVAL_BASE_URL}/${encodeURIComponent(token)}`;

  const html = `
    <h2>Solicitud de nuevo usuario</h2>
    <p><strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}</p>
    <p><strong>Correo:</strong> ${usuario.correo}</p>
    <p><strong>Rol:</strong> ${usuario.rol}</p>
    <a href="${approvalUrl}" style="padding:10px 20px;background:#ff0400;color:white;text-decoration:none;border-radius:8px;">Aprobar Usuario</a>
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
    subject: 'Solicitud de nuevo usuario',
    html
  });
};

module.exports = sendApprovalEmail;
