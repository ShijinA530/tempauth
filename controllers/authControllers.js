const User = require('../models/user');

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