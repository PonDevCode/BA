const mongoose = require('mongoose') // import thư viện mongoose
mongoose.set('strictQuery',true); // chỉ cho phép các thuộc tính được xác định trong schema của mô hình được sử dụng trong các truy vấn. 
require('dotenv').config();

const URL = process.env.MONGO_DB_URL;

const connect = async () =>{
    try {
        await mongoose.connect(URL,{})
        console.log('kết nối thành công');
    } catch (error) {
        console.log('kết nối thất bại');
        console.log(error);
    }

}
    
module.exports = {connect}