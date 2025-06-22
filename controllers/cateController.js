const { CateService, listCateService, deleteCategoryService, updateCategoryService } = require('../services/cateService');

const addCate = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);
    if (!req.files) {
      return res.status(400).json({ message: "Vui lòng chọn ít nhất một ảnh!" });
    }
    // Lấy danh sách đường dẫn ảnh
    const imagePaths = req.files.map(file => file.filename);
    console.log('imagePaths:', imagePaths); // Kiểm tra danh sách file
    // Tạo sản phẩm mới với ảnh
    const cateData = {
      ...req.body,
      img: imagePaths,
    };
    const data = await CateService(cateData);
    // truyền đường dẫn ảnh tạm
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ EC: -1, EM: "Server error" });
  }
};


const listCate = async (req, res) => {
  const result = await listCateService()
  // console.log("cheack result", result);
  return res.status(200).json(result)
}


const deleteCate = async (req, res) => {
  const id = req.params.id
  const result = await deleteCategoryService(id)
  // console.log("cheack result", result);
  return res.status(200).json(result)
}

const updateCategory = async (req, res) => {
  const id = req.params.id
  const formData = req.body
  const data = await updateCategoryService(id, formData)
  return res.status(200).json(data)
}

module.exports = {
  addCate,
  listCate,
  deleteCate,
  updateCategory
}