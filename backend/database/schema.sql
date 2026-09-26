USE support_ticket_db;
CREATE TABLE users (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
password_hash VARCHAR(255) NULL,
role ENUM('customer','agent') NOT NULL DEFAULT 'customer',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tickets (
id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT NOT NULL,
subject VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
status ENUM('open','in_progress','resolved','closed')
NOT NULL DEFAULT 'open',
assigned_to INT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE,
FOREIGN KEY (assigned_to)
REFERENCES users(id)
ON DELETE SET NULL
);
CREATE TABLE ticket_comments (
id INT PRIMARY KEY AUTO_INCREMENT,
ticket_id INT NOT NULL,
user_id INT NOT NULL,
comment TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ticket_id)
REFERENCES tickets(id)
ON DELETE CASCADE,
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE
);
CREATE INDEX idx_tickets_user_id
ON tickets(user_id);
CREATE INDEX idx_tickets_status
ON tickets(status);
CREATE INDEX idx_tickets_priority
ON tickets(priority);
CREATE INDEX idx_tickets_assigned_to
ON tickets(assigned_to);