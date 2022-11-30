const express = require("express");
const User = require('../models/user');
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/:id', (req, res) => {
});
router.post('/', async (req, res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: req.body.passwordHash
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});
router.get('/', (req, res) => {
});
module.exports = router;
export {};
//# sourceMappingURL=users.js.map