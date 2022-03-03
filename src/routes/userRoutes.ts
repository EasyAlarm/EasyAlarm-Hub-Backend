import Router from 'express';
import { createUserSchema, verifyUserSchema } from '../schemas/userSchema';
import validateResource from '../middleware/validateResource';
import { registerUserHandler, loginUserHandler } from '../controllers/userController';

const router = Router();

router.post('/register', validateResource(createUserSchema), registerUserHandler);
router.post('/login', validateResource(verifyUserSchema), loginUserHandler);

export default router;