import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();
// ---------------------funciones usuario +querys
export async function getToDosByID(id) {
    try {
        const [rows] = await pool.query(
            `SELECT todos.*, shared_todos.shared_with_id
            FROM todos
            LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
            WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?
            `,
            [id, id]
        );
        return rows;
    } catch (e) {
        console.error(e);
        return null; 
    }
}
export async function getTodo(id) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM todos WHERE id = ?            
            `,
            [id]
        );
        return rows[0];
    } catch (e) {
        console.error(e);
        return null; 
    }
}
export async function getSharedTodoByID(id) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM shared_todos WHERE todo_id = ?           
            `,
            [id]
        );
        return rows[0];
    } catch (e) {
        console.error(e);
        return null; 
    }
}
export async function getUserByID(id) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE id = ?          
            `,
            [id]
        );
        return rows[0];
    } catch (e) {
        console.error(e);
        return null; 
    }
}
export async function getUserByEmail(email) {
    try {
        const [rows] = await pool.query(
            `
            SELECT * FROM users WHERE email = ?
            `,
            [email]
        );
        return rows[0];
    } catch (e) {
        console.error(e);
        return null; // Manejo de errores: devuelve null en caso de error.
    }
}
//----------------------funciones todo + querys
export async function sharedToDo(todo_id, user_id,shared_with_id) {
    try {
        const [result] = await pool.query(
            `
            INSERT INTO shared_todos(todo_id, user_id,shared_with_id)
            VALUES (?,?,?);
            `,
            [todo_id, user_id,shared_with_id]
        );
        return result.insertId;
    } catch (e) {
        console.error(e);
        return null; // Manejo de errores: devuelve null en caso de error.
    }
}
export async function toggleComplet(id, value) {
    try {
        const newValue = value === true ? "TRUE" : "FALSE";
        const [result] = await pool.query(
            `
            UPDATE todos
            SET completed = ${newValue}
            WHERE id = ?;
            `,
            [id]
        );
        return result;
    } catch (e) {
        console.error(e);
        return null; // Manejo de errores: devuelve null en caso de error.
    }
}
export async function createTodo(user_id, title) {
    try {
        const [result] = await pool.query(
            `
            INSERT INTO todos (user_id,title)
            VALUES (?,?);
            `,
            [user_id,title]
        );
        const todoID = result.insertId;
        return getTodo(todoID);
    } catch (e) {
        console.error(e);
        return null; // Manejo de errores: devuelve null en caso de error.
    }
}
export async function deletedTodo(id) {
    try {
        const [result] = await pool.query(
            `
            DELETE FROM todos WHERE id = ?;
            `,
            [id]
        );
        return result;
    } catch (e) {
        console.error(e);
        return null; // Manejo de errores: devuelve null en caso de error.
    }
}

