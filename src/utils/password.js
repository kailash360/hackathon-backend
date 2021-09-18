const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.hashPassword = async(password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword
}