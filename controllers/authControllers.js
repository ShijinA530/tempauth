const User = require('../models/user');
const Candidate = require('../models/candidate');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { generateRandomPassword } = require('../utils/passwordGenerator');
const nodemailer = require('nodemailer');


module.exports.signup_post = async (req, res) => {
    const { email, ktuid, password } = req.body;

    try {
        const user = await User.create({ email, ktuid, password });
        res.status(201).json({ user });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Assuming User model is imported properly
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User does not exist.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'eth-voting', { expiresIn: '1h' });

        // Set the JWT token as a cookie
        res.json({ token }); // 1 hour expiration time

        // Log the cookie to console for testing
        console.log('JWT token sent to the client:', token);

        // Send a response to the client
        // res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports.candidate_post = async (req, res) => {
    const { firstName, middleName, lastName, department, electionType, party } = req.body;

    try {
        const candidate = await Candidate.create({ firstName, middleName, lastName, department, electionType, party });
        
        res.status(201).json({ candidate });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

module.exports.candidate_get = async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.candidate_delete_post = async (req, res) => {
    const { candidateID } = req.body;

    try {
        const deletedCandidate = await Candidate.findOneAndDelete({ candidateID });

        if (!deletedCandidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        
        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports.voter_get = async (req, res) => {
    try {
        // Fetch all voter data from the database
        const voters = await User.find();

        // Send the fetched voter data as a JSON response
        res.json(voters);
    } catch (error) {
        // Handle errors
        console.error('Error fetching voter data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to send email using nodemailer
const sendEmail = async (email, password) => {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'devoteotp@gmail.com', // Your Gmail email address
      pass: 'rdlg fqyn akws cnmv', // Your Gmail password
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Devote App" devoteotp@gmail.com', // Sender address
    to: email, // List of recipients
    subject: 'Your Password for Voter Data Access', // Subject line
    text: `Here is your password for accessing voter data: ${password}`, // Plain text body
    // html: '<b>Hello world?</b>', // Html body (if needed)
  });

  console.log('Message sent: %s', info.messageId);
};

module.exports.voter_add_post = async (req, res) => {
  try {
    const voterData = req.body;

    voterData.shift();

    for (const entry of voterData) {
      const [ktuID, name, department, year, email] = entry;
      const password = generateRandomPassword();

      // Send email with password
      await sendEmail(email, password);

      // Add user to MongoDB
      await User.create({ email, ktuid: ktuID, password, name, department, year });
    }

    res.status(201).json({ message: 'Voter data added successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};


module.exports.admin_login_post = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ error: 'Admin does not exist.' });
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ adminId: admin._id }, 'your_secret_key', { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); 

        res.status(200).json({ message: 'Login successful', admin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


// delete all collection

// async function deleteAllData() {
//     try {
//         const result = await User.deleteMany({});
//         console.log(`${result.deletedCount} documents deleted successfully.`);
//     } catch (error) {
//         console.error('Error deleting documents:', error);
//     }
// }

// deleteAllData();