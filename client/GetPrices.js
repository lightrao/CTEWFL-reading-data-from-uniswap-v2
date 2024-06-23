const ethers = require("ethers");
require("dotenv").config(); // Load environment variables from .env

const {
  addressFactory,
  addressRouter,
  addressFrom,
  addressTo,
} = require("./AddressList");

const { erc20ABI, factoryABI, pairABI, routerABI } = require("./AbiList");

const urlOrConnectionInfo = process.env.ALCHEMY_URL; // Access the environment variable

// Standard Provider
const provider = new ethers.providers.JsonRpcProvider(urlOrConnectionInfo);

// Connect to Factory Contract
const contractFactory = new ethers.Contract(
  addressFactory,
  factoryABI,
  provider
);

// Connect to Router Contract
const contractRouter = new ethers.Contract(addressRouter, routerABI, provider);

// Function to get token prices
const getPrices = async (amountInHuman) => {
  try {
    const contractToken = new ethers.Contract(addressFrom, erc20ABI, provider);
    const decimals = await contractToken.decimals();
    const amountIn = ethers.utils
      .parseUnits(amountInHuman, decimals)
      .toString();

    const amountsOut = await contractRouter.getAmountsOut(amountIn, [
      addressFrom,
      addressTo,
    ]);

    const contractToken2 = new ethers.Contract(addressTo, erc20ABI, provider);
    const decimals2 = await contractToken2.decimals();

    const amountOutHuman = ethers.utils.formatUnits(
      amountsOut[1].toString(),
      decimals2
    );

    console.log(amountOutHuman);
  } catch (error) {
    console.error("Error fetching prices: ", error);
  }
};

const amountInHuman = "1";
getPrices(amountInHuman);
