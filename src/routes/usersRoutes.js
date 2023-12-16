import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, loginUser } from '../controllers/usersControllers';
import { checkToken, verifyToken } from '../middlewares/auth';

const router = Router();

router.get('/', checkToken, getUsers);
router.post('/', createUser);
router.put('/:id', checkToken, updateUser);
router.delete('/:id', checkToken, deleteUser);
router.post('/login', loginUser);

export default router;
