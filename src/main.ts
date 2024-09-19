import { ethers } from "ethers";
require("dotenv").config();

const provider = new ethers.providers.InfuraProvider(
  "mainnet",
  process.env.INFURA_PROJECT_ID
);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const uniswapRouterAddress = "0xUniswapRouterAddress";  // Це адреса Uniswap Router
const uniswapAbi = [...];  // ABI для Uniswap Router контракту

// Підключаємо контракт Uniswap Router
const uniswapRouter = new ethers.Contract(uniswapRouterAddress, uniswapAbi, wallet);

// Приклад свапу
async function swapTokens(amountIn: ethers.BigNumber, tokenIn: string, tokenOut: string) {
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;  // 20 хвилин для завершення транзакції

    const tx = await uniswapRouter.swapExactTokensForTokens(
        amountIn,
        0,  // мінімальна кількість отриманих токенів (можеш змінити)
        [tokenIn, tokenOut],  // шлях токенів (від токена A до токена B)
        wallet.address,  // адреса отримувача
        deadline
    );

    console.log(`Transaction hash for swap: ${tx.hash}`);
    await tx.wait();  // чекаємо підтвердження транзакції
}

const bridgeContractAddress = "0xParagonsBridgeAddress";  // Це адреса мосту Paragons
const bridgeAbi = [...];  // ABI контракту мосту

// Підключаємо контракт мосту
const bridgeContract = new ethers.Contract(bridgeContractAddress, bridgeAbi, wallet);

// Приклад бриджінгу
async function bridgeTokens(amount: ethers.BigNumberish, destinationAddress: string) {
    const tx = await bridgeContract.bridgeTokens(
        amount,
        destinationAddress
    );

    console.log(`Transaction hash for bridge: ${tx.hash}`);
    await tx.wait();  // чекаємо підтвердження транзакції
}

const multicallAddress = "0xMulticallContractAddress";  // Адреса Multicall контракту
const multicallAbi = [...];  // ABI для Multicall

const multicallContract = new ethers.Contract(multicallAddress, multicallAbi, wallet);

// Приклад мультиколу
async function executeMulticall() {
    const swapData = uniswapRouter.interface.encodeFunctionData("swapExactTokensForTokens", [
        ... // параметри для свапу
    ]);

    const bridgeData = bridgeContract.interface.encodeFunctionData("bridgeTokens", [
        ... // параметри для бриджу
    ]);

    const tx = await multicallContract.aggregate([
        [uniswapRouterAddress, swapData],
        [bridgeContractAddress, bridgeData]
    ]);

    console.log(`Transaction hash for multicall: ${tx.hash}`);
    await tx.wait();  // чекаємо підтвердження
}



