import { Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class CorsMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.header("Access-Control-Allow-Origin", "http://localhost:5173");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    }
}
