CREATE TABLE IF NOT EXISTS product (
    product_key             bigint NOT NULL,
    retailer                varchar(64),
    brand                   varchar(64),
    model                   varchar(32),
    product_name            varchar(128) NOT NULL,
    product_price           numeric(32,2) NOT NULL DEFAULT 0.00,
    product_description     text,
    PRIMARY KEY (product_key)
);
