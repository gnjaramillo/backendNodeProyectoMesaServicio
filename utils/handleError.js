const handleHttpError = (res, message = "Algo sucedió", code = 500) => {
    res.status(code);
    res.send({ error: message });
}

module.exports = { handleHttpError };
