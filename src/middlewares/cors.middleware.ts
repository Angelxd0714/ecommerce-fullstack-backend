import { Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class CorsMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('Headers recibidos:', req.headers);
        console.log('Authorization header:', req.headers['authorization']);
        next();
      }
}
