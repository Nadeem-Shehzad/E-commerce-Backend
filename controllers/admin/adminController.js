


//@desc Get all products
//@route GET /api/products
//@access Public
const getAdmin = (req, res) => {
    res.status(200).json({ message: `current Admin` });
};





module.exports = {
    getAdmin,
}