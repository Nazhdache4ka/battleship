/// <reference types="express-serve-static-core" />

declare global {
  namespace Express {
    interface Request {
      /** Access JWT payload after AuthGuard verification */
      user?: { id: number; email: string };
    }
  }
}

export {};
