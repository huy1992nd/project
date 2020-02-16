


class FileController {
    constructor() {
    }

    Uploadfile(req,res) {
      console.log(" vao day",req.file);
        if (!req.file) {
            console.log("No file received");
            return res.send({
              success: false
            });
        
          } else {
            console.log('file received successfully');
            return res.send({
              file: req.file,
              success: true
            })
          }
    }
  
 
}


module.exports = new FileController();