let errhandler = (err, req, res, next) => {
    // const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    // res.status(statusCode).json({
    //     "success" : false,
    //     "message" : err.message || "Internal Server Error",
    //     "stack" : err.stack,
    // });
    console.log(`status: ${res.statusCode}
        err: ${err.message}
        stack: ${err.stack}
        `);
}

module.exports = errhandler;