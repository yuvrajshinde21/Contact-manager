require("dotenv").config(); //call only once in app.js or index.js

module.exports = {
    db: {
        host: process.env.DB_host,
        user: process.env.DB_user,
        password: process.env.DB_password,
        database: process.env.DB_database,
        port: process.env.DB_port
    },
    port: process.env.listenPort,
}