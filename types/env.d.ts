declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_LIFETIME: string;
      ENV: "test" | "dev" | "prod";
    }
  }
}

export {};
