import { ethers } from "ethers";
require("dotenv").config();

const provider = new ethers.providers.InfuraProvider(
  "goerli",
  process.env.INFURA_PROJECT_ID
);
