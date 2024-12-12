


//@desc Get all products
//@route GET /api/admin/product
//@access Public
const getAllProducts = (req, res) => {
    res.status(200).json({ message: `Admin Get all products` });
};


//@desc Get single product
//@route GET /api/admin/product/:id
//@access Public
const getSingleProduct = (req, res) => {
    res.status(200).json({ message: `Admin Single Product` });
};


//@desc search product
//@route GET /api/admin/product/search
//@access Public
const searchProduct = (req, res) => {
    res.status(200).json({ message: `Admin Search Product` });
};


//@desc Add products
//@route POST /api/admin/product
//@access Public
const addProduct = (req, res) => {
    res.status(200).json({ message: `Add product` });
};


//@desc Update Product
//@route PUT /api/admin/product/:id
//@access Public
const updateProduct = (req, res) => {
    res.status(200).json({ message: `Update Product` });
};


//@desc Delete product
//@route DELETE /api/admin/product/:id
//@access Public
const deleteProduct = (req, res) => {
    res.status(200).json({ message: `Delete Product` });
};






module.exports = {
    getAllProducts,
    getSingleProduct,
    searchProduct,
    addProduct,
    updateProduct,
    deleteProduct
}