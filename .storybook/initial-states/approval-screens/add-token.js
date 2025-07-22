const tokens = {
    "0x33f90dee07c6e8b9682dd20f73e6c358b2ed0f03": {
        "address": "0x33f90dee07c6e8b9682dd20f73e6c358b2ed0f03",
        "symbol": "TRDT",
        "decimals": 18,
        "unlisted": false
    },
    "eth/contracts/trd-smart-contract.sol:contract addresses TRDT",
    { ...Object.entries(tokens).map((_, i) => ({
        ...Object.values(tokens[i]),
        index: i + 1
    })), 'total': 1, 'unlisted': false, 'decimals': 18}
};
