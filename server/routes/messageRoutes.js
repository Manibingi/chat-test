const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:roomId", async (req, res) => {
  const messages = await Message.find({ room: req.params.roomId });
  res.send(messages);
});

router.post("/", async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.status(201).send(message);
});

module.exports = router;
