import { ABI_MUSIC, ABI_CHAT } from '@constants';
import Web3 from 'web3';
import { Contract } from 'web3-eth/node_modules/web3-eth-contract/types/index';
import { logger } from '@constants';

const web3 = new Web3(`${process.env.NETWORK_RPC}`);

const newContract = (abi: any, address: string): Contract => {
  return new web3.eth.Contract(abi, address);
};

const MusicContract = newContract(ABI_MUSIC.Music.abi, ABI_MUSIC.Music.address);
const MarketContract = newContract(ABI_MUSIC.MusicMarket.abi, ABI_MUSIC.MusicMarket.address);
const ChatMarketContract = newContract(ABI_CHAT.ChatMarket.abi, ABI_CHAT.ChatMarket.address);
const stickerContract = newContract(ABI_CHAT.Sticker.abi, ABI_CHAT.Sticker.address);
const CidContract = newContract(ABI_CHAT.CID.abi, ABI_CHAT.CID.address);

const sendTransaction = async (
  contract: any,
  method: string,
  params: any[],
  from: string,
  to: string,
) => {
  logger.info(`Sending transaction to ${to} with method ${method} and params ${params}`);
  const encodeABI = contract.methods[method](...params).encodeABI();
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      data: encodeABI,
      from,
      to,
      gas: 3000000,
    },
    `${process.env.DMTP_OWNER_WALLET_PRIVATE_KEY}`,
  );
  if (signedTx.rawTransaction) await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
};

export {
  web3,
  newContract,
  MusicContract,
  MarketContract,
  ChatMarketContract,
  stickerContract,
  CidContract,
  sendTransaction,
};
