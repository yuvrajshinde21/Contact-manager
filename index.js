const express = require("./src/app.js");
const config = require("./src/config/config.js")
let port =config.port ;

express.listen(port, ()=>{
    console.log(`server started ${port}`)
})