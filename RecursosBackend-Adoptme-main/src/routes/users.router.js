import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import { uploaderDocuments } from '../utils/uploader.js';

const router = Router();

router.get('/',usersController.getAllUsers);

router.post(
    '/:uid/documents',
    uploaderDocuments.array('documents', 25),
    usersController.uploadUserDocuments
);

router.get('/:uid',usersController.getUser);
router.put('/:uid',usersController.updateUser);
router.delete('/:uid',usersController.deleteUser);


export default router;