// import nodeMailer from "nodemailer"      // This method is used in forget Password

// const sendEmail = async(options)=>{

//     const transporter = nodeMailer.createTransport({
//         service : process.env.SMPT_SERVICE, //mail
//         auth : {
//             user : process.env.SMPT_MAIL,     //simple mail transfer protocol
//             pass : process.env.SMPT_PASSWORD,
//         }
//     })

//     const mailOptions = {
//         from: process.env.SMPT_MAIL,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//       };

//       await transporter.sendMail(mailOptions);             // this way email sent
// }

// export {sendEmail}