import { Request } from 'express';
import { v7 as uuidv7 } from 'uuid';
import db from '../../db';
import { BadRequestError, NotFoundError } from '../../errors';
import { RowDataPacket } from 'mysql2';
import Category from '../../api/v1/categories/model'

// Create a new category
const createCategory = async (req: Request): Promise<Category> => {
    const { name } = req.body;
    const id = uuidv7();

    // Check for duplicate name
    const checkQuery = 'SELECT * FROM categories WHERE name = ?';
    const [rows] = await db.query<RowDataPacket[]>(checkQuery, [name]);

    if (rows.length > 0) {
        throw new BadRequestError('Duplicate name');
    }

    // Insert new category
    const insertQuery = 'INSERT INTO categories (id, name) VALUES (?, ?)';
    await db.query(insertQuery, [id, name]);

    // Retrieve the new category
    const selectQuery = 'SELECT id, name, created_at, updated_at FROM categories WHERE id = ?';
    const [result] = await db.query<RowDataPacket[]>(selectQuery, [id]);

    if (result.length === 0) {
        throw new Error('Failed to retrieve new category');
    }

    const newCategory: Category = result[0] as Category;
    return newCategory;
};

// Get all categories
const getAllCategories = async (): Promise<Category[]> => {
    const query = 'SELECT id, name, created_at, updated_at FROM categories';
    const [rows] = await db.query<RowDataPacket[]>(query);
    return rows as Category[];
};

// Get one category by ID
const getCategoryById = async (req: Request): Promise<Category> => {
    const { id } = req.params;

    const query = 'SELECT id, name, created_at, updated_at FROM categories WHERE id = ?';
    const [rows] = await db.query<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
        throw new NotFoundError('Category not found');
    }

    const category: Category = rows[0] as Category;
    return category;
};

// Update category by ID
const updateCategory = async (req: Request): Promise<Category> => {
    const { id } = req.params;
    const { name } = req.body;

    // Check if category exists
    await getCategoryById(req);

    // Update category
    const updateQuery = 'UPDATE categories SET name = ? WHERE id = ?';
    await db.query(updateQuery, [name, id]);

    // Retrieve updated category
    const updatedCategory = await getCategoryById(req);
    return updatedCategory;
};

// Delete category by ID
const deleteCategory = async (req: Request): Promise<void> => {
    const { id } = req.params;

    // Check if category exists
    await getCategoryById(req);

    // Delete category
    const deleteQuery = 'DELETE FROM categories WHERE id = ?';
    await db.query(deleteQuery, [id]);
};

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
