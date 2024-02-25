declare global {
  namespace Express {
    interface Request {
      user: any;
    }
    interface Response {
      user: any;
    }
  }
}

export {};
