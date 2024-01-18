const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const { listeners } = require("../models/orders.model");

const sendEmail = async options => {
  // console.log(options);
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
  let templatePath = options.sendToUser ? userTemplatePath : adminTemplatePath;

	//Send for updating the order status
  if (options.updateEmail) {
		console.log("updateEmail")
    templatePath = path.join("templates", "emails", "update_order.ejs");
  }

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
};

module.exports = sendEmail;
