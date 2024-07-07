import { Request } from 'express';
import { v7 as uuidv7 } from 'uuid';
import argon2 from 'argon2'
import db from '../../db';
import { BadRequestError, NotFoundError } from '../../errors';
import { RowDataPacket } from 'mysql2';
import { User } from '../../api/v1/users/model'

// Create a new User
const createUser = async (req: Request): Promise<User> => {
    const { name, email, password, confirmPassword } = req.body;
    const id = uuidv7();

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
    await db.query(insertQuery, [id, name, email, hashPassword]);

    // Retrieve the new User
    const selectQuery = 'SELECT id, name, email, password, created_at, updated_at FROM users WHERE id = ?';
    const [result] = await db.query<RowDataPacket[]>(selectQuery, [id]);

    if (result.length === 0) {
        throw new Error('Failed to retrieve new User');
    }

    const newUser: User = result[0] as User;
    return newUser;
};

// Get all users
const getAllUsers = async (): Promise<User[]> => {
    const query = 'SELECT id, name, email, created_at, updated_at FROM users';
    const [rows] = await db.query<RowDataPacket[]>(query);
    return rows as User[];
};

// Get one User by ID
const getUserById = async (req: Request): Promise<User> => {
    const { id } = req.params;

    const query = 'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?';
    const [rows] = await db.query<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
        throw new NotFoundError('User not found');
    }

    const user: User = rows[0] as User;
    return user;
};

// Update User by ID
const updateUser = async (req: Request): Promise<User> => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Check if User exists
    const user = await getUserById(req);

    let hashedPassword = user.password;
    if (password) {
        hashedPassword = await argon2.hash(password)
    }

    // Update User
    const updateQuery = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
    await db.query(updateQuery, [name, email, hashedPassword, id]);

    // Retrieve updated User
    const updatedUser = await getUserById(req);
    return updatedUser;
};

// Delete User by ID
const deleteUser = async (req: Request): Promise<void> => {
    const { id } = req.params;

    // Check if User exists
    await getUserById(req);

    // Delete User
    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    await db.query(deleteQuery, [id]);
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
