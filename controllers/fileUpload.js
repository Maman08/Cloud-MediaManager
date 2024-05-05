const File = require("../model/File");
const cloudinary = require('cloudinary').v2;

function isFileSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder,quality) {
    const options = { folder };
    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.localFileUpload = async (req, res) => {
    try {
        const file = req.files.aman; // Extract the uploaded file from the request
        // isko console krne pe file jo tm postman se send kr rhe ho uska name size actual buffer data or saare information aa jaaenge
        console.log(file);

        // Construct the file path...ye hm btaa rhe hain file ko khaa store krna hai server pe
        let path = __dirname + "/testfolder/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log(path);

        // Move the uploaded file to the specified path
        file.mv(path, (err) => {
            if (err) {
                console.error(err); // Log any error that occurs during file move
                res.status(500).json({ success: false, msg: "Error uploading file" }); // Respond with an error message
            } else {
                res.json({ success: true, msg: "Local file uploaded successfully" }); // Respond with a success message
            }
        });
    } catch (error) {
        console.error(error); // Log any other errors that occur
        res.status(500).json({ success: false, msg: "Internal server error" }); // Respond with an error message
    }
};

exports.imageUpload = async (req, res) => {
    try {
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        // Validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const type = file.name.split('.')[1].toLowerCase();

        if (!isFileSupported(type, supportedTypes)) {
            return res.status(400).json({
                success: false,
                msg: "File format is not supported",
            });
        }

        // Upload to Cloudinary
        const response = await uploadFileToCloudinary(file, "codehelp",5);
        console.log("Cloudinary response:", response);

        // Save to database
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        return res.json({
            success: true,
            imageUrl: response.secure_url,
            msg: "Image successfully uploaded",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong",
        });
    }
};

exports.videoUpload = async(req,res)=>{
    try{
           const {name,tags,email} = req.body;
           console.log(name,tags,email);
           
           const file= req.files.vdoFile;
           console.log(file);

           //validation
          const supportedTypes = ["mp4","mov"];
          const fileType = file.name.split('.')[1].toLowerCase();
          console.log("file type",fileType);

           if(!isFileSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success: false,
                msg: "File format is not supported",
            });
           }
           const fileSizeLimit = 5 * 1024 * 1024; // 5MB in bytes

if (file.size > fileSizeLimit) {
    return res.status(400).json({
        success: false,
        msg: "File size exceeds the limit (10MB)",
    });
}

           const response = await uploadFileToCloudinary(file,"codehelp");
           console.log("Cloudinary response:", response);
         

           const fileData = await File.create({
            name,
            tags,
            email,
            vdoUrl: response.secure_url,
        });
        return res.json({
            success: true,
            VdoUrl: response.secure_url,
            msg: "Video successfully uploaded",
        });


    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong",
        });   
    }
};
