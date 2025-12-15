declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };

  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      JWT_SECRET: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      WAVE_API_KEY: string;
      WAVE_API_SECRET: string;
      ORANGE_MONEY_API_KEY: string;
      ORANGE_MONEY_API_SECRET: string;
    }
  }
}

export {};
