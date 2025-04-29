const jwt = require("jsonwebtoken");

function generateVerificationToken(user){
    const token = jwt.sign(
        {email:user.email},
        process.env.EMAIL_VERIFICATION_SECRET,
        {expiresIn:'1h'}
    )
    return token;
}

module.exports = generateVerificationToken;