function weightedRandom(max, numDice) {
    var num = 0;
    for (var i = 0; i < numDice; i++) {
        num += Math.random() * (max / numDice);
    }
    return num;
}

module.exports = { weightedRandom };