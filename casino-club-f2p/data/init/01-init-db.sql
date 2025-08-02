-- Creating the initial database setup script for the Casino-Club F2P project --

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vip_tier VARCHAR(20) DEFAULT 'STANDARD',
    battlepass_level INT DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE user_segments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    rfm_group VARCHAR(20),
    ltv_score DECIMAL(10, 2),
    risk_profile VARCHAR(20),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_actions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50),
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_rewards (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    reward_type VARCHAR(50),
    reward_value DECIMAL(10, 2),
    reward_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gacha_log (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    spin_result VARCHAR(50),
    spin_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shop_transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50),
    amount DECIMAL(10, 2),
    transaction_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE battlepass_status (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    xp INT DEFAULT 0,
    rewards_claimed BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);