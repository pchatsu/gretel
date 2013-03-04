DROP TABLE IF EXISTS article;
DROP TABLE IF EXISTS article_tag;

CREATE TABLE article (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(256) NOT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE article_tag (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    article_id INTEGER NOT NULL,
    value VARCHAR(256) NOT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);