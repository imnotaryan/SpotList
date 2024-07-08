const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failled!");
    }
    const key = "supersecret_dont_share";
    const decodedToken = jwt.decode(token, key.toString());
    req.responseData = { userId: decodedToken.userId };
    next()
  } catch (err) {
    const error = new HttpError("Authentication faiiled.", 403);
    return next(error);
  }
};
