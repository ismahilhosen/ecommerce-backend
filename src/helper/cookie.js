const setRefreshToken = async(res, refreshToken) =>{
    res.cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // secure: true,
        httpOnly: true,
    });
}
const setAccesToken = async(res, accessToken) =>{
    res.cookie("accessToken", accessToken, {
        maxAge: 24 * 60 * 60 * 1000, //24 hour
        // secure: true,
        httpOnly: true,
    });
}

module.exports ={
    setAccesToken,
    setRefreshToken
}