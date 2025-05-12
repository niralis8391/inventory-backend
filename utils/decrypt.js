const crypto = require('crypto');

function decryptData(encryptedData) {
    const key = Buffer.from("12345678901234567890123456789013");
    const iv = Buffer.from("0000000000000000");

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}



module.exports = { decryptData };