mkdir db && cat zim.sql | sqlite3 db/zim.db
cat default_config.json > config.json
npm install