const conn = require("../config/dbConnection");

//@give contacts to bin
exports.getSoftDeletedContacts =async (userid)=>{
    const [result] = await conn.promise().query("select * from contacts where user_id = ? and is_deleted = 1",[userid]);
    return result;
}
