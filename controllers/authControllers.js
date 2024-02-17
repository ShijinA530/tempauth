const User = require('../models/user');
const Candidate = require('../models/candidate');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(400).json({ error: 'User does not exist.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'eth-voting', { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration time

        res.status(200).json({ message: 'Login successful', user });
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