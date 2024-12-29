/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request as ExpressRequest } from 'express';

declare module 'express' {
  export interface Request {
    user?: any; // Define the user property
  }
}
