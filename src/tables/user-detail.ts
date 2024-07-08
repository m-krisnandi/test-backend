import db from '../db';

const createUserDetailTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS user_detail (
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        address VARCHAR(255) NOT NULL,
        mobile_phone VARCHAR(15) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;

    await db.query(query);
    console.log(`Table "user detail" created or already exists`);
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

export default createUserDetailTable;
