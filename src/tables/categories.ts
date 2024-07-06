import db from '../db';

const createCategoriesTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS categories (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await db.query(query);
    console.log(`Table "categories" created or already exists`);
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

export default createCategoriesTable;
