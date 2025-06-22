const fs = require('fs');
const path = require('path')
const Product = require('../models/product/product');
const ProductVariant = require('../models/product/productVariant');

const productService = async (body) => {
  try {
    const result = await Product.create({
      name: body.name,
      category: body.category,
      price: body.price,
      priceSale: body.priceSale,
      description: body.description,
      image: body.img
    });
    return {
      EC: 0,
      EM: 'Create product success',
      product: result,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: 'Create product failed',
    };
  }
};

const uploadImgService = async (id, imageFilenames) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    product.image.push(...imageFilenames);
    await product.save();
    return {
      EC: 0,
      EM: 'success',
      result: imageFilenames
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const productVariantService = async (size, price, product, stock) => {
  try {

    const result = await ProductVariant.create({
      size: size,
      price: price,
      product: product,
      stock: stock
    })
    return {
      EC: 0,
      EM: 'success',
      result: result
    }
  } catch (error) {
    console.log(error);
  }
}

// const listProdctService = async () => {
//   try {
//     const result = await Product.find().populate('category').sort({ createdAt: -1 });
//   return {
//     EC: 0,
//     EM: 'success',
//     result: result
//   };
// } catch (error) {
//   return {     
//     EC: 1,
//     EM: 'failed',
//     result: error
//   };

//   }
// }

const listProdctService = async () => {
  const products = await Product.aggregate([
    {
      $lookup: {
        from: 'productvariants',  // tên collection bên MongoDB (mặc định là model name lowercase + s)
        localField: '_id',        // khóa chính bên Product
        foreignField: 'product',  // khóa ngoại bên ProductVariant
        as: 'variants'            // tên trường mới trong product kết quả
      }
    },
    {
      $lookup: {
        from: 'categories',
        foreignField: '_id',
        localField: 'category',
        as: 'categoryData'
      }
    },
    // Lấy 1 object category (thay vì array)
    {
      $unwind: {
        path: '$categoryData',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $sort: { createdAt: -1 }  // tuỳ chọn, sắp xếp mới nhất lên trên
    },
  ]);
  return products;
};

const prodctDetailService = async (id) => {
  try {
    const product = await Product.findOne({ id: id });
    return product
  } catch (error) {
    return {
      EC: 1,
      EM: 'failed',
      result: error
    };
  }
}
const listProdctCateService = async (category) => {
  try {
    const result = await Product.find({ category: category }).populate('category')
    return {
      EC: 0,
      EM: 'success',
      result: result
    };
  } catch (error) {
    return {
      EC: 1,
      EM: 'failed',
      result: error
    };

  }
}
const deleteProductService = async (id) => {

  try {
    const product = await Product.findById(id);
    if (!product) {
      return {
        EC: 1,
        EM: 'Product not found',
        result: null,
      };
    }
    const imageFiles = product.image || []; // Mảng tên file ảnh
    console.log("imageFiles", imageFiles);

    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    console.log("imagesDir", imagesDir);


    const result = await Product.findByIdAndDelete(id)

    // Xóa từng ảnh
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
    return {
      EC: 0,
      EM: 'Delete Product Success / Xóa Sản Phẩm Thành Công',
      result: result
    };
  } catch (error) {
    console.log(2);

    return {
      EC: 1,
      EM: 'delete product failed',
      result: error
    };
  }
}

  const updateProductService = async (id, formData) => {
    try {
      console.log(id);
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return {
          EC: 1,
          EM: 'Product not found',
        };
      }

      // // Cập nhật từng trường nếu có (bạn có thể thêm các field cần thiết)
      existingProduct.name = formData.name || existingProduct.name;
      existingProduct.description = formData.description || existingProduct.description;
      existingProduct.price = formData.price || existingProduct.price;
      existingProduct.priceSale = formData.priceSale || existingProduct.priceSale;
      existingProduct.category = formData.category || existingProduct.category;

      // // Nếu là update ảnh (có thể là mảng mới hoặc thêm ảnh)
      if (formData.image) {
        existingProduct.image = formData.image; // hoặc bạn có logic thêm ảnh vào mảng
      }
      const imagesDir = path.join(process.cwd(), 'uploads', 'images');
      console.log(existingProduct.imageDelete);
      
      for (const filename of formData.imageDelete) {
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

      const updatedProduct = await existingProduct.save();

      return {
        EC: 0,
        EM: 'Update product successfully',
        DT: updatedProduct,
      };
    } catch (err) {
      console.error('Error in updateProductService:', err);
      return {
        EC: 1,
        EM: 'Failed to update product',
      };
    }
  };

const variantDetailService = async (id) => {
  console.log(id);

  try {
    const variant = await ProductVariant.find({ product: id }).select("-product");
    return variant
  } catch (error) {
    return {
      result: error
    };

  }
}
const variantService = async () => {
  const variant = await ProductVariant.find()
  return variant
}
module.exports = {
  productService,
  listProdctService,
  listProdctCateService,
  deleteProductService,
  productVariantService,
  prodctDetailService,
  variantDetailService,
  variantService,
  updateProductService,
  uploadImgService
};