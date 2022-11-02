// the config.js is a place for hardcoded and global values
const MINE_RATE = 1000; /* 1 Second */
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '_____',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

const STARTING_BALANCE = 10;

const REWARD_INPUT = {
    address: '*authorized-reward*'
};

const MINING_REWARD = 10;

module.exports = { GENESIS_DATA, MINE_RATE, STARTING_BALANCE, REWARD_INPUT, MINING_REWARD };