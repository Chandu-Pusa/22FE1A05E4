const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  redirectURL: { type: String, required: true },
});
const URL = mongoose.model('URL', urlSchema);

app.post('/url', async (req, res) => {
  const { url } = req.body;
  const shortId = nanoid(8);
  await URL.create({ shortId, redirectURL: url });
  res.json({ shortUrl: `http://localhost:5000/${shortId}` });
});

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOne({ shortId });
  if (entry) {
    res.redirect(entry.redirectURL);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});