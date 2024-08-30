import session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        userId: string; 
        [key: string]: any;
    }
}

declare module 'express' {
    interface Request {
        session: session.Session & Partial<session.SessionData>;
    }
}

declare module 'express-serve-static-core' {
    interface Request {
      session: session.Session & Partial<session.SessionData>;
    }
  }
