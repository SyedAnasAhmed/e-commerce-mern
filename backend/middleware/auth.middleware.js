import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized, No token provided!" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired!" });
      }
      throw error;
    }
  } catch (error) {
    console.log("error on the protected route middleware");
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const adminRoute = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decoded.userId);

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized, No token provided!" });
  }

  console.log(user.role);
  if (user && user.role === "admin") {
    next();
  } else {
    console.log("error by the admin route");
    return res.status(403).json({ message: "Access denied - Admin Only!" });
  }
};
