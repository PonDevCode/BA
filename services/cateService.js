const Category = require('../models/product/category');
const path = require('path')
const fs = require('fs');
const CateService = async (body) => {
  try {
    const result = await Category.create({
      name: body.name,
      image: body.img
    });

    console.log('result', result);
    return {
      EC: 0,
      EM: 'Create category success',
      product: result,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: 'Create category failed',
    };
  }
};

const listCateService = async () => {
  try {
    const result = await Category.find({}).sort({ createdAt: -1 });
    return {
      EC: 0,
      cate: result
    }
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      result: error
    }
  }
}
const deleteCategoryService = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return {  
        EC: 1,
        EM: 'Product not found',
        result: null,
      };
    }
    const imageFiles = category.image || []; // Mảng tên file ảnh

    const imagesDir =path.join(process.cwd(), 'uploads', 'images');
    for (const filename of imageFiles) {
          const imagePath = path.join(imagesDir, filename);
          // console.log('imagePath', imagePath);
          try {
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log('Deleted image:', filename);
            } else {
              console.log('File not found:', imagePath);
            }
          } catch (err) {
            console.error('Error deleting file:', err);
          }
        }
    const result = await Category.findByIdAndDelete(id)
    return {
      EC: 0,
      EM: 'delete Category success',
      result: result
    };
  } catch (error) {
    console.log(2);

    return {
      EC: 1,
      EM: 'delete Category failed',
      result: error
    };
  }
}

const updateCategoryService = async (id, formData) => {
  try {
    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      return {
        EC: 1,
        EM: 'Category not found',
      };
    }
    // Cập nhật từng trường nếu có (bạn có thể thêm các field cần thiết)
    existingCategory.name = formData.name || existingCategory.name;
    const updatedCategory = await existingCategory.save();
    return {
      EC: 0,
      EM: 'Update category successfully',
      DT: updatedCategory,
    };
  } catch (err) {
    console.error('Error in updateCategoryService:', err);
    return {
      EC: 1,
      EM: 'Failed to update category',
    };
  }
};

module.exports = {
  listCateService, CateService, deleteCategoryService, updateCategoryService
};