const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://thushanmadusanka456:thushan2001@cluster0.xvcff4a.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


const bookSchema = new mongoose.Schema({
  id:{
    type: String,
    required:true
  },
  bookname:{
    type :String,
    required:true
  },
  author:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  price:{
    type:String,
    required:true
  }
});

// Create Model
const book = mongoose.model('books', bookSchema);

module.exports = book;
