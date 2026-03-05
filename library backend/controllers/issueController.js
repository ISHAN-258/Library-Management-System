const Issue = require('../models/Book_Issue');
const StudentProfile = require('../models/StudentProfile');

const emailService = require('../services/emailService');

exports.issueBook = async (req, res) => {
    const { studentEmail, bookTitle, issueDate, returnDate } = req.body;

  try {
    const student = await StudentProfile.findOne({ email: studentEmail });

    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: "No student found with this email. Please check and try again."
      });
    }
    
    const newIssue = new Issue({ studentEmail, bookTitle, issueDate, returnDate });
    await newIssue.save();

    // Send email notification
    const emailSent = await emailService.sendIssueNotification(
      studentEmail, 
      bookTitle, 
      issueDate, 
      returnDate
    );

    res.status(200).json({ 
      message: "Book issued successfully",
      emailSent: emailSent
    });
  } catch (err) {
    res.status(500).json({ message: "Error issuing book 11" });
  }
};

exports.getBook = async (req, res) => {
  try {
    const { email } = req.query; 
    let books;
    console.log(email);

    if (email) {
      books = await Issue.find({ studentEmail : email });
    } else {
      books = await Issue.find();
    }

    res.status(200).json({ data: books });
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
};


exports.getBookByEmail = async (req,res)=>{
  const { studentEmail } = req.body;
  try{
    const book = await Issue.find({studentEmail});
    res.status(200).json(book);
  }
  catch(err){
    res.status(500).json({ message: "Error fetching book" });
  }
};

exports.updateBook = async(req,res)=>{
  const {id} = req.params;
  const { studentEmail, bookTitle, issueDate, returnDate } = req.body;
  try{
    const book = await Issue.findByIdAndUpdate(id, {studentEmail, bookTitle, issueDate, returnDate}, {new: true});
      res.status(200).json(book);
  }
  catch(err){
    res.status(500).json({ message: "Error updating book" });
  }

};

exports.deletebookbyid=async(req,res)=>{
  const {id} = req.params;
  try{
    await Issue.findByIdAndDelete(id);
    res.status(200).json({ message: "Book deleted successfully" });
    }
    catch(err){
      res.status(500).json({ message: "Error deleting book" });
      }
      
}

exports.getIssueCountByMonth = async (req, res) => {
  try {
    const result = await Issue.aggregate([
      {
        $group: {
          _id: { $month: { $toDate: "$issueDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = [
      "", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const formatted = result.map(item => ({
      month: monthNames[item._id],
      count: item.count
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching monthly issue count", error: err.message });
  }
};