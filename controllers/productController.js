const { productService, listProdctService, listProdctCateService, deleteProductService, productVariantService, prodctDetailService, variantDetailService, variantService, updateProductService, uploadImgService } = require('../services/productService');

const addProduct = async (req, res) => {
  try {
    // console.log("FILES RECEIVED:", req.files);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Vui lòng chọn ít nhất một ảnh!" });
    }
    // Lấy danh sách đường dẫn ảnh
    const imagePaths = req.files.map(file => file.filename);
    // Tạo sản phẩm mới với ảnh
    const productData = {
      ...req.body,
      img: imagePaths,
    };
    const data = await productService(productData);
    // truyền đường dẫn ảnh tạm
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: -1, EM: "Server error" });
  }
};



const addProductVariant = async (req, res) => {
  const { size, price, product, stock } = req.body;
  const data = await productVariantService(size, price, product, stock)
  return res.status(200).json(data)
}
const updateProduct = async (req, res) => {
  const id = req.params.id
  const formData = req.body
  console.log(FormData);
  
  const data = await updateProductService(id, formData)
  return res.status(200).json(data)
}
const uploadImg = async (req, res) => {
  const id = req.params.id;
  const imageFilenames = req.files.map(file => file.filename);
  const product = await uploadImgService(id, imageFilenames)
  if(product){
    return res.status(200).json(product)
  }

}
const variant = async (req, res) => {
  const variant = await variantService()
  return res.status(200).json(variant)

}

const listProduct = async (req, res) => {
  try {
    const data = await listProdctService()
    return res.status(200).json(data)
  } catch (error) {
    console.log(error)
  }
}
const productDetail = async (req, res) => {
  try {
    const id = req.params.id
    const product = await prodctDetailService(id)
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const variant = await variantDetailService(id)
    console.log(variant);
    return res.status(200).json({
      EC: 0,
      EM: 'success',
      product,
      variant
    })
  } catch (error) {
    console.log(error)
  }
}

const listProductCate = async (req, res) => {
  const category = req.query.Category;
  console.log("cheakc", category);
  try {
    const data = await listProdctCateService(category)
    console.log(data);
    return res.status(200).json(data)
  } catch (error) {
    console.log(error);
  }
}

const deleteProduct = async (req, res) => {
  const id = req.params.id
  const result = await deleteProductService(id)
  return res.status(200).json(result)
}



module.exports = {
  addProduct,
  listProduct,
  listProductCate,
  deleteProduct,
  addProductVariant,
  productDetail,
  variant,
  updateProduct,
  uploadImg
}