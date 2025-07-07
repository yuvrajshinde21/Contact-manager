const conn = require("../config/dbConnection");

//@get contacts
exports.getContacts = async (userid) => {
    let [result] = await conn.promise().execute("SELECT * FROM contacts where user_id =? and is_deleted = 0 ", [userid]);
    return result;
}

// //@create contact
// //check duplicate
// //@todo later you can check duplicte only for non delete and at time of bin restor handle error
// exports.checkDuplicate = async (email, phone, userid) => {
//     let [result] = await conn.promise().execute("SELECT * FROM contacts WHERE  user_id = ? AND (email = ? or phone = ?)", [userid, email, phone]);
//     return result;
// }
//insert contact
exports.createContact = async (firstname, lastname, email, phone, address, birthday, notes, userid) => {
    birthday = birthday || null
    let [result] = await conn.promise().execute("insert into contacts (first_name,last_name, email, phone,address, birthday,notes, user_id) values(?, ?, ?, ?, ?, ?, ?, ?)", [firstname, lastname, email, phone, address, birthday, notes, userid]);//is_deleted = 0 default
    return result;
}

//@getcontact
exports.getContact = async (id, userid) => {
    let [result] = await conn.promise().execute("select * from contacts where id = ? and user_id = ? and is_deleted = 0 ", [id, userid]);
    return result[0];
};


//@update contact
exports.updateContact = async (first_name, last_name, email, phone, address, birthday, notes, id, userid) => {
    let [result] = await conn.promise().execute("update contacts set first_name = ?,last_name = ?, email = ?, phone = ? ,address = ?,birthday = ?, notes = ? where id = ? and user_id =? and is_deleted = 0", [first_name, last_name, email, phone, address, birthday, notes, id, userid]);
    return result;
}
//@delete contact
exports.deleteContact = async (id, userid) => {
    let [result] = await conn.promise().execute("UPDATE contacts SET is_deleted = 1 WHERE id = ? and user_id = ?", [id, userid]);
    return result;
}

//@search 
exports.search = async (val, userid) => {
    const likeVal = `%${val}%`;
    let [result] = await conn.promise().query("select * from contacts where (last_name like ? OR first_name like ?) and user_id = ? and is_deleted = 0", [likeVal, likeVal, userid]);
    return result;
}

// @findDulpicateEmail
exports.checkDulpicateEmail = async (email, id, userid) => {
    let [result] = await conn.promise().query("select * from contacts where email = ?  and user_id= ? and id != ? and is_deleted = 0", [email, userid, id]);
    return result
}
// @findDulpicatePhone
exports.checkDulpicatePhone = async (phone, id, userid) => {
    let [result] = await conn.promise().query("select * from contacts where phone = ? and user_id= ? and id != ? and is_deleted = 0", [phone, userid, id]);
    return result
}

// @restore from bin
exports.restoreContacts = async (id, userid) => {
    let [result] = await conn.promise().query("update contacts set is_deleted = 0 where id = ? and user_id =? ", [id, userid]);
    return result
}
// @permently delete contacts from bin
exports.deleteContactFromBin = async (id, userid) => {
    let [result] = await conn.promise().query("delete from contacts where id = ? and user_id = ? ", [id, userid]);
    return result;
}

