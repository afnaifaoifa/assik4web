const User = require('../models/user');



const createUser = async (req, res) => {
    const {username, password, isAdmin} = req.body;

    await User.create({username, password, isAdmin, createdAt: new Date(), updatedAt: new Date()});

    res.send({success: true})
}

const deleteUser = async (req, res) => {
    const {userId} = req.params;

    await User.deleteOne({_id: userId})

    res.send({success: true})
}

const updateUser = async (req, res) => {
    const {userId} = req.params;
    const newDatas = req.body;

    await User.updateOne({_id: userId}, newDatas);

    res.send({success: true});
}

module.exports = {
    createUser,
    deleteUser,
    updateUser
}