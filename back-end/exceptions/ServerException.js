class ServerException extends Error {
    constructor(message = 'Internal Server Error') {
        super(message);
        this.status = 500;
        this.message = message;
    }
}

module.exports = ServerException;
