import { Request } from 'express';
import { v7 as uuidv7 } from 'uuid';
import db from '../../db';
import { BadRequestError, NotFoundError } from '../../errors';
import { RowDataPacket } from 'mysql2';
import { Post, ExternalPost } from '../../api/v1/posts/model'
import { PoolConnection } from 'mysql2/promise';
import axios from 'axios';

// Create a new Post
const createPost = async (req: Request): Promise<Post> => {
    const { title, content, category_id } = req.body;
    const image_url = req.file ? `uploads/${req.file.filename}` : '';
    const id = uuidv7();

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Check for duplicate title
        const checkQuery = 'SELECT * FROM posts WHERE title = ?';
        const [rows] = await connection.query<RowDataPacket[]>(checkQuery, [title]);

        if (rows.length > 0) {
            throw new BadRequestError('Duplicate title');
        }

        // Insert new Post
        const insertQuery = 'INSERT INTO posts (id, title, content, category_id, image_url) VALUES (?, ?, ?, ?, ?)';
        await connection.query(insertQuery, [id, title, content, category_id, image_url]);

        // Retrieve the new Post
        const selectQuery = `
        SELECT p.id, p.title, p.content, p.image_url, p.created_at,
            p.updated_at, c.id AS category_id, c.name AS category_name
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
        `;
        const [result] = await connection.query<RowDataPacket[]>(selectQuery, [id]);

        if (result.length === 0) {
            throw new Error('Failed to retrieve new Post');
        }

        const newPost: Post = {
            id: result[0].id,
            title: result[0].title,
            content: result[0].content,
            category: {
                id: result[0].category_id,
                name: result[0].category_name,
            },
            image_url: result[0].image_url,
            created_at: result[0].created_at,
            updated_at: result[0].updated_at,
        };

        // Commit transaction
        await connection.commit();
        connection.release();

        return newPost;
    } catch (error) {
        // Rollback transaction
        await connection.rollback();
        connection.release();
        throw error;
    }
};

const fetchExternalData = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const getAllPosts = async (): Promise<Post[]> => {
    let postsFromDB: Post[] = [];
    let postsFromExternal: Post[] = [];

    // Fetch data from database
    const query = `
        SELECT p.id, p.title, p.content, p.image_url, p.created_at,
            p.updated_at, c.id AS category_id, c.name AS category_name
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
    `;
    const [rows] = await db.query<RowDataPacket[]>(query);
    
    if (rows.length > 0) {
        postsFromDB = rows.map(row => ({
            id: row.id, 
            title: row.title,
            content: row.content,
            category: {
                id: row.category_id,
                name: row.category_name,
            },
            image_url: row.image_url,
            created_at: row.created_at,
            updated_at: row.updated_at,
        }));
    }

    // Fetch data from external API
    const externalDataUrl = 'https://jsonplaceholder.typicode.com/posts';
    const externalData: ExternalPost[] = await fetchExternalData(externalDataUrl);

    // Map external data to Post format
    postsFromExternal = externalData.map(data => ({
        id: data.id.toString(), 
        title: data.title,
        content: data.body,
        category: {
            id: "0", 
            name: "Default Category", 
        },
        image_url: '', 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString(), 
    }));

    // Combine posts from database and external data
    const combinedPosts: Post[] = [...postsFromDB, ...postsFromExternal];

    return combinedPosts;
};

const getPostById = async (req: Request, connection?: PoolConnection): Promise<Post> => {
    const { id } = req.params;

    const query = `
        SELECT p.id, p.title, p.content, p.image_url, p.created_at,
            p.updated_at, c.id AS category_id, c.name AS category_name
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    `;

    try {
        const [rows] = connection
            ? await connection.query<RowDataPacket[]>(query, [id])
            : await db.query<RowDataPacket[]>(query, [id]);

        // fetch from external API
        if (rows.length === 0) {
            const externalDataUrl = `https://jsonplaceholder.typicode.com/posts/${id}`;
            const externalData: ExternalPost = await fetchExternalData(externalDataUrl);

            // Construct post object from external data
            const post: Post = {
                id: externalData.id.toString(), 
                title: externalData.title,
                content: externalData.body,
                category: {
                    id: "0", 
                    name: "Default Category", 
                },
                image_url: '', 
                created_at: new Date().toISOString(), 
                updated_at: new Date().toISOString(), 
            };

            return post;
        }

        // database query result
        const row = rows[0];
        const post: Post = {
            id: row.id,
            title: row.title,
            content: row.content,
            category: {
                id: row.category_id,
                name: row.category_name,
            },
            image_url: row.image_url,
            created_at: row.created_at,
            updated_at: row.updated_at,
        };

        return post;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error; 
        }

        throw new Error('Failed to fetch post');
    }
};



// Update post by ID
const updatePost = async (req: Request): Promise<Post> => {
    const { title, content, category_id } = req.body;
    const image_url = req.file ? `uploads/${req.file.filename}` : '';

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Check if Post exists
        const existingPost = await getPostById(req, connection);

        // Update Post
        const updateQuery = 'UPDATE posts SET title = ?, content = ?, category_id = ?, image_url = ? WHERE id = ?';
        await connection.query(updateQuery, [title, content, category_id, image_url, existingPost.id]);

        // Commit transaction
        await connection.commit();
        connection.release();

        const updatedPost: Post = {
            id: existingPost.id,
            title,
            content,
            category: {
                id: category_id,
                name: existingPost.category.name, 
            },
            image_url,
            created_at: existingPost.created_at, 
            updated_at: new Date().toISOString(), 
        };

        return updatedPost;
    } catch (error) {
        // Rollback transaction
        await connection.rollback();
        connection.release();
        throw error;
    }    
};


// Delete Post by ID
const deletePost = async (req: Request): Promise<void> => {
    const { id } = req.params;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
         // Check if Post exists
        await getPostById(req);

        // Delete Post
        const deleteQuery = 'DELETE FROM posts WHERE id = ?';
        await connection.query(deleteQuery, [id]);

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

export { createPost, getAllPosts, getPostById, updatePost, deletePost };
