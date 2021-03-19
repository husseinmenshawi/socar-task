const express = require("express");
const router = express.Router();

module.exports = (app) => {
  app.use("/", router);
};

router.get("/", (req, res) => {
  res.status(200);
  res.json({
    status: "Great Hussein! The server actually runs!",
    timeStamp: new Date().toISOString(),
    headers: Object.assign({}, req.headers),
  });
});
