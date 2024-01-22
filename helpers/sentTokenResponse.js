const { sendResponse } = require("./response");

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  let cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    path: "/dashboard",
  };

  // if (process.env.NODE_ENV === "production") {
  //   cookieOptions.secure = true;
  // }

  // if (process.env.NODE_ENV === "development") {
  //   cookieOptions.secure = true;
  // }

  return sendResponse(
    res,
    {
      status: "Sucess",
      token,
    },
    statusCode,
    "application/json",
    (setCookie = true),
    (options = cookieOptions)
  );
};

module.exports = sendTokenResponse;
