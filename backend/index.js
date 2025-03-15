// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/auth", authRoutes);

const lessonPreferenceRoutes = require("./routes/lessonPreferenceRoutes");
app.use("/api/lesson", lessonPreferenceRoutes);

const PeerPreference = require("./routes/peerRoutes");
app.use("/api/peer", PeerPreference);

const ContentPreference = require("./routes/contentRoutes");
app.use("/api/content", ContentPreference);

const courseContentRoutes = require('./routes/lessonRoutes');
app.use('/api/course', courseContentRoutes);

const specializationRoutes = require('./routes/specialRoutes');
app.use('/api/specialize', specializationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));