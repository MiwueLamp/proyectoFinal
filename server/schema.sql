CREATE DATABASE myToDo;
USE myToDo;


CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255)
);
CREATE TABLE todos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE shared_todos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    todo_id INT,
    user_id INT,
    shared_with_id INT,
    FOREIGN KEY (todo_id) REFERENCES todos(id)ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)ON DELETE CASCADE,
    FOREIGN KEY (shared_with_id) REFERENCES users(id)ON DELETE CASCADE
);
INSERT INTO users (name, email, password) VALUES
('Usuario1', 'usuario1@example.com', 'password1'),
('Usuario2', 'usuario2@example.com', 'password2'),
('Usuario3', 'usuario3@example.com', 'password3'),
('Usuario4', 'usuario4@example.com', 'password4');

INSERT INTO todos (title, completed, user_id) VALUES
('Hacer ejercicio 🏋️‍♂️', false, 1),
('Estudiar español 📚', false, 2),
('Completar informe 📊', false, 1),
('Comprar víveres 🛒', false, 3),
('Reunión de equipo 🤝', false, 2),
('Llamar a mamá 📞', false, 1),
('Leer libro 📖', false, 2),
('Planificar viaje ✈️', false, 3),
('Preparar presentación 🖥️', false, 4),
('Enviar informe mensual 📧', false, 4);

INSERT INTO shared_todos (todo_id, user_id, shared_with_id) VALUES
(1, 1, 2),
(2, 2, 3);

SELECT todos.*, shared_todos.shared_with_id
FROM todos
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE todos.user_id = [user_id] OR shared_todos.shared_with_id = [user_id]
