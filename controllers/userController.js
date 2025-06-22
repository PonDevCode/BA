
const { createUserServices,
    loginUserSevices,
    getUserServices,
    requestRefreshTokenService,
    deleteUserService,
    EditUserService
} = require("../services/userService");



const createUser = async (req, res) => {
    // console.log('cheack req', req.body);
    const { name, email, password } = req.body
    const data = await createUserServices(name, email, password)
    console.log("create user", data);
    return res.status(200).json(data)
}
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginUserSevices(email, password)
    // console.log('cheack data', data);
    if (data.EC === 0) {
        res.cookie('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: false, // Chỉ gửi qua HTTPS nếu production
            sameSite: 'strict',
            path: '/'
        });
        return res.status(200).json(data)
    } else {
        return res.status(401).json(data)
    }


}

const refresh_Token = (req, res) => {

    const refresh_Token = req.cookies.refresh_token

    if (!refresh_Token) {
        return res.status(401).json({ message: 'Refresh token not found' });
    }

    const data = requestRefreshTokenService(refresh_Token)
    console.log(data);

    if (data.EC === 0) {
        res.cookie('refresh_token', data.newRefresh_token, {
            httpOnly: true,
            secure: false, // Chỉ gửi qua HTTPS nếu production
            sameSite: 'strict',
            path: '/'
        });
        return res.status(200).json(data)
    } else {
        return res.status(401).json(data)
    }



}

const getUser = async (req, res) => {
    const data = await getUserServices()
    return res.status(200).json(data)
}

const deleteUser = async (req, res) => {
    const id = req.params.id
    const data = await deleteUserService(id)
    // console.log(data);
    return res.status(200).json(data)
}
const editUser = async (req, res) => {
    const id = req.params.id
    const formData = req.body
    const data = await EditUserService(id, formData)
    return res.status(200).json(data)
}

module.exports = {
    createUser,
    loginUser,
    getUser,
    deleteUser,
    refresh_Token,
    editUser
}

