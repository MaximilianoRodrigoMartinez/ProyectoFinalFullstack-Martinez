import { usersService } from "../services/index.js";
import __dirname from "../utils/index.js";

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    res.send({status:"success",message:"User deleted"})
}

const uploadUserDocuments = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });
    const files = req.files;
    if (!files?.length) return res.status(400).send({ status: "error", error: "No files uploaded" });
    const newDocs = files.map((file) => ({
        name: file.originalname,
        reference: `${__dirname}/../public/img/documents/${file.filename}`
    }));
    const updated = await usersService.pushDocuments(userId, newDocs);
    res.send({ status: "success", payload: updated });
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    uploadUserDocuments
}