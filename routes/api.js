var express = require('express');
var router = express.Router();
const upload = require('../middleware/multer');
const {
  createUser,
  loginUser,
  getUser,
  refresh_Token,
  deleteUser,
  editUser
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const {
  addProduct,
  listProduct,
  listProductCate,
  deleteProduct,
  addProductVariant,
  productDetail,
  variant,
  updateProduct,
  uploadImg
} = require('../controllers/productController');
const { addCate, listCate, deleteCate, updateCategory } = require('../controllers/cateController');


/* GET users listing. */



router.post('/v1/refresh', refresh_Token)
router.post('/v1/resigter', createUser)
router.post('/v1/login', loginUser)
router.all("*", auth);
router.get('/', (req, res) => {
  return res.status(200).json("Hello boy")
});



router.get('/v1/user', getUser)
router.delete('/v1/user/delete/:id', deleteUser)
router.put('/v1/user/edit/:id', editUser)






router.get('/v1/category', listCate)
router.post('/v1/addCate', [upload.array('image', 4)], addCate);
router.put('/v1/updateCate/:id', [upload.array('image', 4)], updateCategory);
router.delete('/v1/deleteCate/:id', deleteCate)



router.get('/v1/product', listProduct)
router.get('/v1/variant', variant)


router.get('/v1/product/:id', productDetail)


router.get('/v1/listProductCate', listProductCate)
router.post('/v1/addProduct', [upload.array('image', 4)], addProduct);
router.put('/v1/update/:id', [upload.array('image', 4)], updateProduct);
router.post('/v1/uploadImg/:id', [upload.array('image', 4)], uploadImg)
router.delete('/v1/delete/:id', deleteProduct)

router.post('/v1/productVariant', addProductVariant)


module.exports = router;  