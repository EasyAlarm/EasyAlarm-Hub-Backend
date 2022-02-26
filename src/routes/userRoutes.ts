import Router from 'express';
import { createUserSchema } from '../schema/userSchema';
import validateResource from '../middleware/validateResource';
import { registerUserHandler, loginUserHandler } from '../controllers/userController';

const router = Router();

router.post('/register', registerUserHandler);
router.post('/login', loginUserHandler);

export default router;