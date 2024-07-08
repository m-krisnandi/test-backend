import { Request } from 'express';
import { v7 as uuidv7 } from 'uuid';
import argon2 from 'argon2'
import db from '../../db';
import { BadRequestError, NotFoundError } from '../../errors';
import { RowDataPacket } from 'mysql2';
import { User } from '../../api/v1/users/model'
import { PoolConnection } from 'mysql2/promise';

// Create a new User
const createUser = async (req: Request): Promise<User> => {
    const { name, email, password, confirmPassword, address, mobilePhone } = req.body;
    const id = uuidv7();

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
         // Check for duplicate name
        const checkQuery = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query<RowDataPacket[]>(checkQuery, [email]);

        if (rows.length > 0) {
            throw new BadRequestError('Email already use');
        }

        if (password != confirmPassword) {
            throw new BadRequestError("Password and confirm password are not the same")
        }

        const hashPassword = await argon2.hash(password);

        // Insert new User
        const insertQuery = 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)';
        await connection.query(insertQuery, [id, name, email, hashPassword]);

        // Insert User Detail
        const userDetailId = uuidv7();
        const insertUserDetailQuery = 'INSERT INTO user_detail (id, address, mobile_phone, user_id) VALUES (?, ?, ?, ?)';
        await connection.query(insertUserDetailQuery, [userDetailId, address, mobilePhone, id]);

        // Retrieve the new User
        const selectQuery = `
        SELECT u.id, u.name, u.email, u.password, ud.address, ud.mobile_phone, 
            u.created_at, u.updated_at 
        FROM users u 
        LEFT JOIN user_detail ud ON u.id = ud.user_id
        WHERE u.id = ?`;
        const [result] = await connection.query<RowDataPacket[]>(selectQuery, [id]);

        if (result.length === 0) {
            throw new Error('Failed to retrieve new User');
        }

        const newUser: User = {
            id: result[0].id,
            name: result[0].name,
            email: result[0].email,
            password: result[0].password,
            address: result[0].address,
            mobile_phone: result[0].mobile_phone,
            created_at: result[0].created_at,
            updated_at: result[0].updated_at,
        };

        await connection.commit();
        connection.release();

        return newUser;
    } catch (error) {
        // Rollback transaction
        await connection.rollback();
        connection.release();
        throw error;
    }
};

// Get all users
const getAllUsers = async (): Promise<User[]> => {
    const query = `
        SELECT u.id, u.name, u.email, ud.address, ud.mobile_phone, 
            u.created_at, u.updated_at 
        FROM users u 
        LEFT JOIN user_detail ud ON u.id = ud.user_id`;
    const [rows] = await db.query<RowDataPacket[]>(query);
    return rows as User[];
};

// Get one User by ID
const getUserById = async (req: Request, connection?: PoolConnection): Promise<User> => {
    const { id } = req.params;

    const query = `
        SELECT u.id, u.name, u.email, ud.address, ud.mobile_phone, 
            u.created_at, u.updated_at 
        FROM users u 
        LEFT JOIN user_detail ud ON u.id = ud.user_id
        WHERE u.id = ?`;
    const [rows] = connection
        ? await connection.query<RowDataPacket[]>(query, [id])
        : await db.query<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
        throw new NotFoundError('User not found');
    }

    const user: User = rows[0] as User;
    return user;
};

const updateUser = async (req: Request): Promise<User> => {
    const { id } = req.params;
    const { name, email, password, address, mobilePhone } = req.body;
    
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Check if User exists
        const existingUser = await getUserById(req, connection);

        let hashedPassword = existingUser.password;
        if (password) {
            hashedPassword = await argon2.hash(password);
        }

        // Update User
        const updateUserQuery = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
        await connection.query(updateUserQuery, [name, email, hashedPassword, id]);

        // Update User Detail
        const updateUserDetailQuery = 'UPDATE user_detail SET address = ?, mobile_phone = ? WHERE user_id = ?';
        await connection.query(updateUserDetailQuery, [address, mobilePhone, id]);

        // Commit transaction
        await connection.commit();
        connection.release();

        // Retrieve updated User
        const [result] = await db.query<RowDataPacket[]>(`
            SELECT u.id, u.name, u.email, u.password, ud.address, ud.mobile_phone, 
                u.created_at, u.updated_at 
            FROM users u 
            LEFT JOIN user_detail ud ON u.id = ud.user_id
            WHERE u.id = ?`, [id]);

        if (result.length === 0) {
            throw new Error('Failed to retrieve updated User');
        }

        const updatedUser: User = {
            id: result[0].id,
            name: result[0].name,
            email: result[0].email,
            password: result[0].password,
            address: result[0].address,
            mobile_phone: result[0].mobile_phone,
            created_at: result[0].created_at,
            updated_at: result[0].updated_at,
        };

        return updatedUser;
    } catch (error) {
        // Rollback transaction
        await connection.rollback();
        connection.release();
        throw error;
    }
};


// Delete User by ID
const deleteUser = async (req: Request): Promise<void> => {
    const { id } = req.params;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Check if User exists
        await getUserById(req, connection);

        // Delete User Detail
        const deleteUserDetailQuery = 'DELETE FROM user_detail WHERE user_id = ?';
        await connection.query(deleteUserDetailQuery, [id]);

        // Delete User
        const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
        await connection.query(deleteUserQuery, [id]);

        // Commit transaction
        await connection.commit();
        connection.release();
    } catch (error) {
        // Rollback transaction
        await connection.rollback();
        connection.release();
        throw error;
    }
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
