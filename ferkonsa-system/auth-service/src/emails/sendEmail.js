const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });


//log para verificar a quien va el corre BOORAR LUEGO
console.log("📧 Enviando a:", to);
  await transporter.sendMail({
    from: `"FERKONSA" <${process.env.EMAIL_USER}>`,
    to: String(to),
    subject,
    html
  });
};

module.exports = sendEmail;



//VERSION FORZADA BORRAR LUEGO
/*const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // LOG PARA DEPURAR
  console.log("📧 Enviando a:", to);

  // PRUEBA: fuerza el destinatario para validar si Gmail respeta el campo "to"
  const testMailOptions = {
    from: `"FERKONSA" <${process.env.EMAIL_USER}>`,
    to: "tucorreoalternativo@gmail.com", // 🔁 cambia esto a otro correo tuyo distinto del EMAIL_USER
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(testMailOptions);
    console.log("✅ Resultado:", info.response);
  } catch (err) {
    console.error("❌ Error al enviar correo:", err.message);
  }
};

module.exports = sendEmail;

*/
