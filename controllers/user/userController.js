


//@desc Get all products
//@route GET /api/products
//@access Public
const getUser = (req, res) => {
    res.status(200).json({ message: `current user` });
};





module.exports = {
    getUser,
}