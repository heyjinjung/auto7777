-- 프리미엄 젬 필드 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_gems INTEGER DEFAULT 0;

-- 가챠 로그 테이블
CREATE TABLE IF NOT EXISTS gacha_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    gacha_type VARCHAR(50),
    item_rarity VARCHAR(50),
    item_name VARCHAR(100),
    item_type VARCHAR(50),
    item_value INTEGER,
    cost INTEGER,
    currency VARCHAR(20),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 상점 아이템 테이블
CREATE TABLE IF NOT EXISTS shop_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    currency VARCHAR(20) NOT NULL,
    category VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 상점 거래 기록 테이블
CREATE TABLE IF NOT EXISTS shop_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    item_id INTEGER REFERENCES shop_items(id),
    quantity INTEGER DEFAULT 1,
    price_per_item INTEGER,
    total_price INTEGER,
    currency VARCHAR(20),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 초기 상점 아이템 추가
INSERT INTO shop_items (name, description, price, currency, category) VALUES
('초보자 패키지', '100 코인 + 5 젬', 100, 'COIN', 'PACKAGE'),
('프리미엄 젬 10개', '프리미엄 젬 10개', 1000, 'COIN', 'CURRENCY'),
('럭키 박스', '랜덤 보상 상자', 50, 'COIN', 'LOOTBOX'),
('VIP 3일권', '3일간 VIP 혜택', 30, 'GEM', 'VIP'),
('경험치 부스터', '1시간 경험치 2배', 10, 'GEM', 'BOOSTER');

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_gacha_logs_user_id ON gacha_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_transactions_user_id ON shop_transactions(user_id);