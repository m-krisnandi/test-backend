import db from '../db';

const createPostsTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS posts (
        id CHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category_id CHAR(36),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `;

    await db.query(query);
    console.log(`Table "posts" created or already exists`);
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

export default createPostsTable;
