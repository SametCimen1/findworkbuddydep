CREATE TABLE groups(
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE,
    subject varchar(255) NOT NULL,
    description varchar(255)
);


CREATE TABLE comment(
    id SERIAL PRIMARY KEY,
    text varchar(500),
    userid integer,
    userImg  varchar(255),
    userName varchar(255)
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(20)  UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    following integer[],
    followreq integer[],
    newcomment integer[],    
    followers integer[],
    isPublic boolean,
    groupID integer ARRAY, 
    ownimg boolean,
    about varchar(255),
    role varchar(6),
    active boolean,
    confirm varchar(255),
    image varchar(255)
);




CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    userId integer REFERENCES users(id),
    image varchar(255),
    header varchar(255) NOT NULL,
    paragraph varchar(1000) NOT NULL,
    keywords text[],
    likes integer,
    commentby integer[],
    likedby integer[],
    username varchar(200) NOT NULL,
    uploadtime timestamp
);


INSERT INTO users (name, email)
VALUES('samet', 'cimensamet338@gmail.com');

DROP TABLE users;
DROP TABLE groups;
DROP TABLE posts;




ALTER TABLE users
ADD followers integer[];


ALTER TABLE users
DROP test;

ALTER TABLE users
DROP friendnum;

DELETE FROM posts WHERE id = 1;
DELETE FROM users WHERE id = 1;


ALTER TABLE users
RENAME COLUMN newcommnet TO newcomment;