//requirements
const crypto = require('crypto');


//Variables
const secret = 'FourFiveFourFiveFourFiveFourFive'


//Encrypt Process
const encrypt = (password)=>{

    const iv = Buffer.from(crypto.randomBytes(16))
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(secret), iv);

    const EncryptedPassword = Buffer.concat([
        cipher.update(password),
        cipher.final(),
    
    ]);

    return {
        iv: iv.toString("hex"), 
        password: EncryptedPassword.toString("hex")
    };
};

const decrypt = (encryption)=>{

    const decipher = crypto.createCipheriv(
        'aes-256-ctr', 
        Buffer.from(secret), 
        Buffer.from(encryption.iv, "hex")
    );

    const decryptedPassword = Buffer.concat([
        decipher.update(Buffer.from(encryption.password, "hex")),
        decipher.final(),
    
    ]);

    return decryptedPassword.toString();

};

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;