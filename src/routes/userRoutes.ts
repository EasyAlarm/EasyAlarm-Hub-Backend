import Router from 'express';
import { createUserSchema, refreshTokenSchema, verifyUserSchema } from '../schemas/userSchema';
import validateResource from '../middleware/validateResource';
import { registerUserHandler, loginUserHandler, refreshTokenHandler } from '../controllers/userController';

const router = Router();

router.post('/register', validateResource(createUserSchema), registerUserHandler);
router.post('/login', validateResource(verifyUserSchema), loginUserHandler);
router.post('/refresh', validateResource(refreshTokenSchema), refreshTokenHandler);

export default router;