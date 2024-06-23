const ethers = require("ethers");
require("dotenv").config(); // Load environment variables from .env file

// Import necessary addresses and ABIs from custom modules
const {
  addressFactory,
  addressRouter,
  addressFrom,
  addressTo,
} = require("./AddressList");

const { erc20ABI, factoryABI, pairABI, routerABI } = require("./AbiList");

// Access the Alchemy URL from the environment variables
const urlOrConnectionInfo = process.env.ALCHEMY_URL;

// Create a standard JSON-RPC provider to interact with the Ethereum blockchain
const provider = new ethers.providers.JsonRpcProvider(urlOrConnectionInfo);

// Connect to the factory contract using its address, ABI, and the provider
const contractFactory = new ethers.Contract(
  addressFactory,
  factoryABI,
  provider
);

// Connect to the router contract using its address, ABI, and the provider
const contractRouter = new ethers.Contract(addressRouter, routerABI, provider);

// Asynchronous function to get token prices
const getPrices = async (amountInHuman) => {
  try {
    // Connect to the ERC20 token contract for the input token (addressFrom)
    const contractToken = new ethers.Contract(addressFrom, erc20ABI, provider);

    // Fetch the number of decimals for the input token
    const decimals = await contractToken.decimals();

    // Convert the human-readable input amount to the token's smallest unit
    const amountIn = ethers.utils
      .parseUnits(amountInHuman, decimals)
      .toString();

    // Get the output amounts for the swap from addressFrom to addressTo
    const amountsOut = await contractRouter.getAmountsOut(amountIn, [
      addressFrom,
      addressTo,
    ]);

    // Connect to the ERC20 token contract for the output token (addressTo)
    const contractToken2 = new ethers.Contract(addressTo, erc20ABI, provider);

    // Fetch the number of decimals for the output token
    const decimals2 = await contractToken2.decimals();

    // Convert the output amount to a human-readable format
    const amountOutHuman = ethers.utils.formatUnits(
      amountsOut[1].toString(),
      decimals2
    );

    // Log the human-readable output amount to the console
    console.log(amountOutHuman);
  } catch (error) {
    // Log any errors that occur during the execution of the function
    console.error("Error fetching prices: ", error);
  }
};

// Define the input amount in human-readable format (1 token in this case)
const amountInHuman = "1";

// Call the getPrices function with the input amount
getPrices(amountInHuman);
