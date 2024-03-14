const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://thushanmadusanka456:thushan2001@cluster0.xvcff4a.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


const bookSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  
});

// Create Model
const User = mongoose.model('users', bookSchema);

module.exports = User;
