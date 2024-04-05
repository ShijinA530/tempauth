const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173' }));

mongoose.connect('mongodb+srv://temp:temp123@jwt-auth.iow4rvc.mongodb.net/De-vote')
    .then(() => app.listen(3000))
    .catch((err) => console.log(err));

app.use(authRoutes);