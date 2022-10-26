const fs = require("fs");


module.exports = {
    photo: async (photoDum) => {
        const photoPath = __dirname + "\\1.jpg";
        
        const imgData = fs.readFileSync(`.\\img\\${photoDum}.jpg`);
        
        return imgData;
    }
}