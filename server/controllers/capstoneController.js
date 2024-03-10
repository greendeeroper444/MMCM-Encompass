const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const AdminModel = require('../models/adminModel');
const CapstoneModel = require('../models/capstoneModel');

//set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'files/');
    },
    filename: function (req, file, cb){
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, 'capstonefile-' + uniqueSuffix + path.extname(file.originalname));
        cb(null, file.originalname);
    },
});
  
//init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).single('pdf');


const uploadCapstone = async(req, res) => {
    try {

        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ error: 'Unauthorized - Missing token' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async(err, decodedToken) => {
            if(err){
                return res.status(401).json({ 
                    error: 'Unauthorized - Invalid token' 
                });
            } else{
                const adminId = decodedToken.id;

                const adminExists = await AdminModel.findById(adminId);
                if(!adminExists){
                    return res.status(401).json({ 
                        error: 'Unauthorized - Admin does not exist' 
                    });
                }

                //handle file upload
                upload(req, res, async(err) => {
                    if(err){
                        console.error(err);
                        return res.status(500).json({
                            error: 'Error uploading file' 
                        });
                    } else{
                        //file uploaded successfully
                        const {title, description, author} = req.body;
                        const pdfFileName = req.file.filename;

                        //construct the URL for the PDF file
                        const pdfPath = `${req.protocol}://${req.get('host')}/files/${pdfFileName}`;

                        //create a new Capstone document
                        const newCapstone = await CapstoneModel.create({
                            title,
                            description,
                            author,
                            pdf: pdfPath,
                            admin: adminId,
                        });

                        return res.json({
                            message: 'Capstone uploaded successfully!',
                            capstone: newCapstone,
                            pdfPath: pdfPath, 
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}



const searchCapstones = async(req, res) => {
    try {
        const searchQuery = req.query.q;
        
        //split the search query into individual words
        const searchWords = searchQuery.trim().split(/\s+/);
        
        //construct an array of regex conditions for each word in title and author
        const titleRegexConditions = searchWords.map(word => ({ title: { $regex: `.*${word}.*`, $options: 'i' } }));
        const authorRegexConditions = searchWords.map(word => ({ author: { $regex: `.*${word}.*`, $options: 'i' } }));
        
        //perform the search using the $or operator on the constructed conditions
        const results = await CapstoneModel.find({
            $or: [
                { $or: titleRegexConditions },
                { $or: authorRegexConditions },
                { description: { $regex: `.*${searchQuery}.*`, $options: 'i' } },
            ],
        });
        
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};


const searchCapstoneSuggests = async(req, res) => {
    try {
        const searchQuery = req.query.q;
        
        //construct regex pattern for search query
        const regexPattern = new RegExp(searchQuery, 'i');

        //search for capstones where title or author matches the search query
        const results = await CapstoneModel.find({
            $or: [
                { title: { $regex: regexPattern } },
                { author: { $regex: regexPattern } }
            ]
        }).select('title author');

        //xxtract titles and authors from results
        const suggestions = results.map(capstone => `${capstone.title} by ${capstone.author}`);
        
        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}


const getCapstoneDetails = async(req, res) => {
    try {
        const capstoneId = req.params.capstoneId;
        const capstone = await CapstoneModel.findById(capstoneId);

        if(!capstone){
            return res.status(404).json({ 
                error: 'Capstone not found' 
            });
        }

        res.json(capstone);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}
  

const updateCapstone = async(req, res) => {
    try {
        const capstoneId = req.params.capstoneId;
        const capstone = await CapstoneModel.findById(capstoneId);

        if(!capstone){
            return res.json({ 
                error: 'Capstone not found' 
            });
        }

        //handle file upload
        upload(req, res, async(err) => {
            if(err){
                console.error(err);
                return res.status(500).json({
                    error: 'Error uploading file' 
                });
            } else{
                const { title, description, author } = req.body;

                //update capstone details
                capstone.title = title;
                capstone.description = description;
                capstone.author = author;
                
                //to chheck if a new PDF file is uploaded
                if(req.file){
                    const pdfFileName = req.file.filename;
                    const pdfPath = `${req.protocol}://${req.get('host')}/files/${pdfFileName}`;
                    capstone.pdf = pdfPath;
                }

                await capstone.save();

                return res.json({
                    message: 'Capstone updated successfully!',
                    capstone,
                });
            }
        });
    } catch (error) {
        console.error(error);
        return res.json({ 
            error: 'Internal Server Error' 
        });
    }
}


//get capstone with capstone Id
const getCapstoneUpdate = async(req, res) => {
    try {
        const capstoneId = req.params.capstoneId;
        const capstone = await CapstoneModel.findById(capstoneId);

        if(!capstone){
            return res.status(404).json({ 
                error: 'Capstone not found' 
            });
        }

        return res.json({ capstone: capstone });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    uploadCapstone,
    searchCapstones,
    getCapstoneDetails,
    searchCapstoneSuggests,
    updateCapstone,
    getCapstoneUpdate,
};
