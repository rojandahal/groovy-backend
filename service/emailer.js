const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const sendEmail = async options => {
  console.log(options);
  // Code to send email
  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  if (!options.to) {
    return {
      status: "fail",
      message: "Please provide email address",
    };
  }

  // Assuming options is an object with properties like user, to, subject
  const userTemplatePath = path.join(
    "templates",
    "emails",
    "userorder_user.ejs"
  );
  const adminTemplatePath = path.join(
    "templates",
    "emails",
    "userorder_admin.ejs"
  );

  // Determine which template to use based on recipient
  const templatePath =
    options.to === "mr.dahalrojan@gmail.com"
      ? adminTemplatePath
      : userTemplatePath;

  ejs.renderFile(templatePath, { user: options.user }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      // Define the email options
      const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: data,
      };

      // Actually send the email
      transporter
        .sendMail(mailOptions)
        .then(() => {
          console.log(`Email sent successfully to ${options.to}`);
        })
        .catch(err => {
          console.log(err);
        });
    }
  });

  // // Assuming options is an object with properties like user, to, subject
  // const userTemplatePath = path.join(
  //   "templates",
  //   "emails",
  //   "userorder_user.ejs"
  // );
  // const adminTemplatePath = path.join(
  //   "templates",
  //   "emails",
  //   "userorder_admin.ejs"
  // );

  // // Determine which template to use based on recipient
  // const templatePath =
  //   options.to === "mr.dahalrojan@gmail.com"
  //     ? adminTemplatePath
  //     : userTemplatePath;

  // // Assuming options is an object with properties like user, to, subject
  // ejs.renderFile(
  //   path.join("templates", "emails", "userorder.ejs"),
  //   { user: options.user },
  //   function (err, data) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       // Define the email options
  //       const mailOptions = {
  //         from: options.from,
  //         to: options.to,
  //         subject: options.subject,
  //         html: data,
  //       };

  //       // Actually send the email
  //       transporter
  //         .sendMail(mailOptions)
  //         .then(() => {
  //           // Setup email options to send to ADMIN
  //           mailOptions.to = "mr.dahalrojan@gmail.com";

  //           transporter.sendMail(mailOptions, function (err, info) {
  //             if (err) {
  //               console.log(err);
  //             } else {
  //               console.log("Email sent successfully to admin");
  //             }
  //           });

  //           console.log("Email sent successfully to user");
  //         })
  //         .catch(err => {
  //           console.log(err);
  //         });
  //     }
  //   }
  // );
};

module.exports = sendEmail;
