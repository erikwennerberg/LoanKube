function error(originatingresponse, interimreponse = null, message = null) {
    if (interimreponse != null)
        originatingresponse.pipe(interimreponse);

    if (message != null) {
        console.log(`error - ${message}`);
        originatingresponse.status(500).send(message);
    }
    else
        originatingresponse.sendStatus(500);
}
function complete(originatingresponse, interimreponse = null, message = null) {
    if (interimreponse != null)
        originatingresponse.pipe(interimreponse);

    if (message != null) {
        console.log(`complete - ${message}`);
        originatingresponse.status(200).send(message);
    }
    else
        originatingresponse.sendStatus(200);
}

module.exports = {
    error,
    complete
}