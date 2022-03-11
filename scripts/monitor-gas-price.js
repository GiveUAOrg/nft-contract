require('dotenv').config();
const axios = require('axios').default;
const hre = require("hardhat");

const toGwei = (dfPrice) => {
    return Math.floor(dfPrice / 10);
}

const getPrices = (latestBlockNum) => {
    return axios.get(`https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=${process.env.DEFI_PULSE_KEY}`)
        .then((response) => {
            const data = response.data;
            console.log(
                `Latest #${latestBlockNum}, Prices #${data.blockNum}, safeLow: ${toGwei(data.safeLow)},  average: ${toGwei(data.average)},  fast: ${toGwei(data.fast)}`
            );

            if (data.average <= 170) {
                require("./deploy-contract");
            }
        })
        .catch((error) => {
            // handle error
            console.log(error);
        });
}

hre.ethers.provider.on('block', async (blockNumber) => {
    await getPrices(blockNumber);
});