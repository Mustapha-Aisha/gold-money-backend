const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) {
        console.log(err);
        res.status(401).json({ error: "User is not authorized" });
      } else {
          req.user = decoded.user;
          next();
      }
    });
    if (!token) {
        res.status(401).json({ error: "User is not authorized or token is missing" });
    }
  }
};

module.exports = validateToken;