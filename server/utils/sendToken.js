export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ Cookie only sent over HTTPS in production
      sameSite: "None",                              // ✅ Required for cross-site requests (e.g., frontend on Vercel or Railway)
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      user,
      message,
      token,
    });
};
