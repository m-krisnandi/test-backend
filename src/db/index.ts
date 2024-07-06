import mysql from 'mysql2/promise';
import config from '../configs'

const { dbHost, dbUser, dbPassword, dbName } = config.dbConfig;

const db = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

// Function to check connection
const checkConnection = async () => {
  try {
    await db.getConnection();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

// Call the function to check connection
checkConnection();

export default db;
