-- MILLETSETU DATABASE SCHEMA
-- Platform: Supabase (PostgreSQL)
-- Features: Supply Chain Tracking, Blockchain Verification (Sepolia), Market Orders

-- 1. SELLERS (Users & Farmers)
-- Stores profile information for Farmers, Processors, and Retailers.
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    seller_name TEXT NOT NULL,
    seller_type TEXT NOT NULL CHECK (seller_type IN ('farmer', 'processor', 'retailer', 'fpo')),
    district TEXT,
    wallet_balance NUMERIC DEFAULT 0.00
);

-- 2. PRODUCTS (Inventory & Tokenized Assets)
-- Represents the physical millet batches. Includes Blockchain hashes for traceability.
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    seller_id UUID REFERENCES sellers(id),
    product_name TEXT NOT NULL,
    quantity INTEGER,
    unit TEXT DEFAULT 'kg',
    price NUMERIC,
    image_url TEXT,
    district TEXT,
    status TEXT DEFAULT 'available', -- 'sold', 'processing', 'available'
    
    -- Blockchain Traceability
    tx_hash TEXT, -- The transaction hash on Sepolia Network
    etherscan_link TEXT, -- Direct link to view proof on blockchain
    
    -- Certification Details
    certificate_url TEXT,
    certificate_type TEXT,
    certificate_status TEXT,
    certificate_expiry DATE,
    source_product_id UUID -- For tracking processed goods back to raw material
);

-- 3. PRODUCT JOURNEY (Supply Chain Events)
-- Tracks every step of the product (Harvest -> Process -> Pack -> Ship).
CREATE TABLE product_journey (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_id UUID REFERENCES products(id),
    actor_id UUID REFERENCES sellers(id), -- Who performed this action
    event_name TEXT NOT NULL, -- e.g., 'Harvested', 'Quality Check', 'Dispatched'
    event_details TEXT,
    event_icon TEXT,
    tx_hash TEXT -- Blockchain proof for this specific step
);

-- 4. PRODUCT ORDERS (Marketplace Transactions)
-- Handles the buying and selling logic.
CREATE TABLE product_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_id UUID REFERENCES products(id),
    seller_id UUID REFERENCES sellers(id),
    buyer_id UUID REFERENCES sellers(id),
    quantity_ordered INTEGER NOT NULL,
    total_price NUMERIC NOT NULL,
    order_status TEXT DEFAULT 'pending', -- 'completed', 'cancelled'
    buyer_tx_hash TEXT -- Payment transaction hash
