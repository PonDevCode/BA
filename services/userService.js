require("dotenv").config();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/user')
const jwt = require("jsonwebtoken")
const createUserServices = async (name, email, password) => {
    try {
        // cheack user 
        const cheackUser = await User.findOne({ email: email })
        // console.log('cheackUser', cheackUser);
        if (cheackUser) {
            return {
                data: {
                    EC: 9,
                    EM: "email already exists / email đã tồn tại"
                }
            }
        } else {
            const hashPassword = await bcrypt.hash(password, saltRounds);
            // console.log(('cheack'),hashPassword);
            let result = await User.create({
                name: name,
                email: email,
                password: hashPassword,
                role: 'nhanvien'
            })
            return {
                data: {
                    EC: 0,
                    EM: "Create user sucess",
                    user: result
                }
            }
        }

    } catch (error) {
        console.log(error);
        // return null 
    }
}
// Tạo access_token + refresh_token (generate_access_token ) + (generate_refresh_token)

const generate_access_token = (user) => {
    const payload = {
        email: user.email,
        name: user.name
    }
    const access_token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_expiresIn1
        }
    )
    if (user) {
        return {
            access_token: access_token,
        }
    }
}

const generate_refresh_token = (user) => {
    const payload = {
        email: user.email,
        name: user.name
    }
    const refresh_token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_expiresIn2
        }
    )
    if (user) {
        return {
            refresh_token: refresh_token,
        }
    }
}

const requestRefreshTokenService = (refresh_Token) => {

    const res = jwt.verify(refresh_Token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.log(error);

        }
        const newAccess_token = generate_access_token(user).access_token
        const newRefresh_token = generate_refresh_token(user).refresh_token
        return {
            newAccess_token,
            newRefresh_token
        }
    })
    return {
        EC: 0,
        EM: 'refresh success',
        res
    }
}

const loginUserSevices = async (email, password) => {
    try {
        let loginUser = await User.findOne({ email: email })
        console.log('cheack user', loginUser);
        if (loginUser) {
            const hashPassword = await bcrypt.compare(password, loginUser.password);
            console.log(hashPassword);
            if (hashPassword) {
                try {
                    return {

                        EC: 0,
                        EM: 'Login success',
                        access_token: generate_access_token(loginUser).access_token,
                        refresh_token: generate_refresh_token(loginUser).refresh_token,
                        user: {
                            email: loginUser.email,
                            name: loginUser.name
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                return {
                    EC: 1,
                    EM: 'Login false'
                }
            }

        } else {
            return {
                EC: 1,
                EM: "Email/ Password Không Hợp Lệ"
            }
        }
    } catch (error) {
        console.log("null rồi nè");
    }
}




const getUserServices = async () => {

    try {
        const result = await User.find({}).select("-password").sort({ createdAt: -1 })
        return result
    } catch (error) {
        console.log(error);

    }
}

const deleteUserService = async (id) => {
    try {
        const data = await User.findByIdAndDelete(id)
        if (!data) {
            return {
                EC: 1,
                EM: 'user not found',
                result: null,
            };
        } else {
            return {
                EC: 0,
                EM: 'Delete user success',
                result: data,
            };
        }
    } catch (error) {
        console.log(error);

    }
}
const EditUserService = async (id, formData) => {
    try {
        const existingUser = await User.findById(id)
        if (!existingUser) {
            return {
                EC: 1,
                EM: 'User not found / User Không Tìm Thấy'
            }
        }
        // Cập nhật từng trường nếu có (bạn có thể thêm các field cần thiết)
        existingUser.name = formData.name || existingUser.name;
        existingUser.email = formData.email || existingUser.email;
        existingUser.role = formData.role || existingUser.role;

        const editUser = await existingUser.save();
        if (editUser) {
            return {
                EC: 0,
                EM: 'Edit User successfully / Chỉnh sửa người dùng thành công',
                DT: editUser,
            };
        } else {
            return {
                EC: 1,
                EM: 'Edit User failed / Chỉnh sửa người dùng thất bại',
                DT: null,
            };
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    createUserServices,
    loginUserSevices,
    getUserServices,
    requestRefreshTokenService,
    deleteUserService,
    EditUserService
}