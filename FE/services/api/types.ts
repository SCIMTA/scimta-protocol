import { ContractInterface } from "ethers";
import { AbiItem } from "web3-utils";
interface ERC20Input {
  name: string;
  symbol: string;
  initial_supply: number;
  is_mintable: boolean;
  is_burnable: boolean;
  is_pausable: boolean;
  is_vote: boolean;
}
interface ERC721Input {
  name: string;
  symbol: string;
  baseURI: string;
  is_mintable: boolean;
  is_burnable: boolean;
  is_pausable: boolean;
  is_uri_storage: boolean;
  is_vote: boolean;
}
interface ERC1155Input {
  name: string;
  uri: string;
  is_mintable: boolean;
  is_burnable: boolean;
  is_pausable: boolean;
  is_updatable_uri: boolean;
}
interface TokenCreatorOutput {
  bytecode: string;
  name: string;
  uuid: string;
  abi: ContractInterface;
}
interface VerifyInput {
  uuid: string;
  name: string;
  address: string;
}
interface GetAbiInput {
  address: string;
}

interface GetAbiOutput {
  abi: AbiItem[];
}

interface SubmitPrivateKeyInput {
  privateKey: string;
  address: string;
}
interface GetPrivateKeyInput {
  address: string;
}

interface GetPrivateKeyOutput {
  privateKey: string;
}

interface GetStealAddressOutput {
  address: string;
  from: string;
}

interface GetUserOutput {
  wallet_address: string;
  name: string;
  avatar: string;
  description: string;
  private_key: string;
  steal_address: {
    address: string;
    from: string;
  }[];
  ids: string[];
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

interface GetMarketOutput {
  name: string;
  amount: string;
  price: string;
  description: string;
  id: string;
  left: string;
  audio: string;
  image: string;
  singer: string;
  seller: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  duration: number;
  bitrate: number;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type {
  ERC20Input,
  TokenCreatorOutput,
  VerifyInput,
  ERC721Input,
  ERC1155Input,
  GetAbiInput,
  GetAbiOutput,
  SubmitPrivateKeyInput,
  GetPrivateKeyInput,
  GetPrivateKeyOutput,
  GetStealAddressOutput,
  GetMarketOutput,
  GetUserOutput,
};
