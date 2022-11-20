import { Request } from 'express';
import { UserDocument } from 'src/schemas/user.schema';

export type RequestWithUser = Request & { user: UserDocument };
