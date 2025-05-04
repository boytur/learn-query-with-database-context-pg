-- Users
INSERT INTO users (name, email, password) VALUES
('Alice', 'alice@example.com', 'hashed_password_1'),
('Bob', 'bob@example.com', 'hashed_password_2'),
('Charlie', 'charlie@example.com', 'hashed_password_3');

-- Posts
INSERT INTO posts (user_id, title, content, published) VALUES
(1, 'Welcome to My Blog', 'This is my first post!', TRUE),
(2, 'Thoughts on JavaScript', 'JavaScript is both great and terrible.', TRUE),
(1, 'Unpublished Draft', 'Coming soon...', FALSE),
(3, 'PostgreSQL Tips', 'Let''s optimize your queries.', TRUE);  -- แก้ไขที่นี่

-- Comments
INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'Nice post!'),
(1, 3, 'Thanks for sharing.'),
(2, 1, 'I totally agree!'),
(4, 2, 'Love this tip!');

-- Tags
INSERT INTO tags (name) VALUES
('javascript'),
('postgresql'),
('webdev'),
('tutorial');

-- Post_Tags
INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 3),  -- Welcome to My Blog → webdev
(2, 1),  -- Thoughts on JS → javascript
(2, 3),
(4, 2),  -- PostgreSQL Tips → postgresql
(4, 4);  -- PostgreSQL Tips → tutorial
