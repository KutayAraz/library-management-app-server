-- Create database with proper character set and collation
CREATE DATABASE IF NOT EXISTS library_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE library_management;

-- Create User table
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_name (name)
) ENGINE=InnoDB;

-- Create Book table
CREATE TABLE book (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_book_name (name),
    INDEX idx_book_author (author)
) ENGINE=InnoDB;

-- Create BookLending table
CREATE TABLE book_lending (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NULL,
    is_returned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_lending_user (user_id),
    INDEX idx_lending_book (book_id),
    INDEX idx_lending_status (is_returned)
) ENGINE=InnoDB;

-- Create BookRating table
CREATE TABLE book_rating (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT score_range CHECK (score >= 0 AND score <= 10),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE INDEX idx_user_book_rating (user_id, book_id),
    INDEX idx_rating_book (book_id)
) ENGINE=InnoDB;

-- Insert some sample data
INSERT INTO user (name) VALUES
    ('John Doe'),
    ('Jane Smith'),
    ('Bob Johnson'),
    ('Alice Brown');

INSERT INTO book (name, author, year) VALUES
    ('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 1979),
    ('I, Robot', 'Isaac Asimov', 1950),
    ('Dune', 'Frank Herbert', 1965),
    ('1984', 'George Orwell', 1949),
    ('Brave New World', 'Aldous Huxley', 1932);

-- Add some sample book lendings
INSERT INTO book_lending (user_id, book_id, is_returned, return_date) VALUES
    (1, 1, true, DATE_SUB(NOW(), INTERVAL 2 MONTH)),
    (2, 2, true, DATE_SUB(NOW(), INTERVAL 1 MONTH)),
    (3, 3, false, NULL),
    (4, 4, false, NULL);

-- Add some sample book ratings
INSERT INTO book_rating (user_id, book_id, score) VALUES
    (1, 1, 9),
    (2, 1, 8),
    (1, 2, 7),
    (2, 2, 8),
    (3, 1, 9),
    (4, 2, 6);

-- Create view for book statistics
CREATE OR REPLACE VIEW book_statistics AS
SELECT 
    b.id,
    b.name,
    b.author,
    COUNT(DISTINCT bl.id) as total_lendings,
    COUNT(DISTINCT CASE WHEN bl.is_returned = 0 THEN bl.id END) as current_lendings,
    COALESCE(AVG(br.score), 0) as average_rating,
    COUNT(DISTINCT br.id) as total_ratings
FROM book b
LEFT JOIN book_lending bl ON b.id = bl.book_id
LEFT JOIN book_rating br ON b.id = br.book_id
GROUP BY b.id, b.name, b.author;