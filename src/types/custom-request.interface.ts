/* eslint-disable prettier/prettier */
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: any; // Extend the Request object to include the user property
}
