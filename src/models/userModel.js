const conn = require("../config/dbConnection");
//@register
//userExists
exports.userExists =async (email)=>{
    let [result] = await conn.promise().execute("select * from users where  email = ?",[ email])
    return result;
}
//register
exports.registerUser = async (name, email, hashedPassword) => {
    let [result] = await conn.promise().execute("insert into users(name, email,password) values (?,?,?)",[name,  email, hashedPassword]);
    return result;
};

//@login
// exports.loginUser = async () => {
//     let [result] = conn.promise().execute();
//     return result;
// };

//@current
exports.currentUser = async () => {
    let [result] = conn.promise().execute();
    return result;
};