import dotenv from 'dotenv';

dotenv.config();

interface DBConfig {
    dbHost: string;
    dbUser: string;
    dbPassword: string;
    dbName: string;
}

interface Config {
    jwtSecret: string;
    jwtExpiration: string;
    dbConfig: DBConfig;
}

const config: Config = {
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiration: process.env.JWT_EXPIRATION || '',
    dbConfig: {
        dbHost: process.env.DB_HOST || '',
        dbUser: process.env.DB_USER || '',
        dbPassword: process.env.DB_PASSWORD || '',
        dbName: process.env.DB_NAME || '',
    },
};

export default config;
