import dotenv from 'dotenv';

// Load Configuration File
if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: 'config/.env.test' });
} else {
    dotenv.config({ path: 'config/.env' });
}

const config = {
    AUTH: {
        SECRET: process.env.TOKEN_SECRET || '',
        PEPPER: process.env.BCRYPT_PASSWORD,
        SALT_ROUNDS: process.env.SALT_ROUNDS || '10'
    },
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE: {
        HOST: process.env.DATABASE_HOST || 'localhost',
        NAME: process.env.DATABASE_NAME || 'postgres',
        USER: process.env.DATABASE_USER || 'postgres',
        PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
        PORT: parseInt(process.env.DATABASE_PORT || '5432', 10)
    },
    CORS: {
        origin: 'somesite.com',
        optionalSuccessStatus: 200
    }
};

export default config;
