const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connecting to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/studentDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect('mongodb+srv://puneeth_:6y0USVCK5j0AAXdd@cluster0.gieaqmx.mongodb.net/studentDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => console.log('Connection to the database successful!'));
mongoose.connection.on('error', error => console.error('Connection error:', error));
// mongoose.connect()

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
});

const Student = mongoose.model('Student', studentSchema);


// Routes
//old code
app.get('/students', async (req, res) => {
    try {
      const {page,maxrec} = req.query;
      const students = await Student.find({}).limit(maxrec).skip((page-1)*maxrec);
      res.json(students);
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
// app.get('/students', async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
  
//       const startIndex = (page - 1) * limit;
//       const endIndex = page * limit;
  
//       const students = await Student.find({})
//         .skip(startIndex)
//         .limit(limit);
  
//       const totalStudentsCount = await Student.countDocuments();
  
//       const pagination = {
//         currentPage: page,
//         totalPages: Math.ceil(totalStudentsCount / limit),
//       };
  
//       res.json({ students, pagination });
//     } catch (err) {
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//   });
  
  app.post('/students', async (req, res) => {
    try {
      const { name, email, mobile } = req.body;
      const newStudent = new Student({ name, email, mobile });
      await newStudent.save();
      res.send('Student added successfully.');
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });
  

  
  app.put('/students/:id', async (req, res) => {
    try {
      const { name, email, mobile } = req.body;
      await Student.findByIdAndUpdate(req.params.id, { name, email, mobile });
      res.send('Student updated successfully.');
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.delete('/students/:id', async (req, res) => {
    try {
      await Student.findByIdAndDelete(req.params.id);
      res.send('Student deleted successfully.');
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
