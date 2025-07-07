let mysql = require("mysql2");
let config = require("./config");

let conn = mysql.createConnection(config.db);

conn.connect((err)=>{
    if(err){
       console.log("database connection err",err.message);
    }else{
    console.log("db connected!")
    }
})

module.exports = conn;