    // const mongoose = require('mongoose') // import thư viện mongoose
    // mongoose.set('strictQuery',true); // chỉ cho phép các thuộc tính được xác định trong schema của mô hình được sử dụng trong các truy vấn. 
    // require('dotenv').config();


    // const connect = async () =>{
    //     try {
    //         await mongoose.connect('mongodb+srv://pondevcode:vMPWO9hW3hVJ4y5Q@pondev.liucfuf.mongodb.net/BA?retryWrites=true&w=majority&appName=Pondev',{})
    //         console.log('kết nối thành công');
    //     } catch (error) {
    //         console.log('kết nối thất bại');
    //         console.log(error);
    //     }

    // }
        
    // module.exports = {connect}



const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();
console.log(process.env.MONGO_URI);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ kết nối MongoDB thành công');
    } catch (error) {
        console.log('❌ kết nối MongoDB thất bại');
        console.log(error);
    }
};

module.exports = { connect };
