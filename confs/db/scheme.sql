CREATE TABLE todo (id INTEGER PRIMARY KEY AUTOINCREMENT,
 title,
 content,
 created_at,
 updated_at,
 status,
 progress,
 marked,
 tags
 );

 CREATE TABLE tags (
 title,
 created_at,
 updated_at,
 color
 );