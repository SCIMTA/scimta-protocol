import { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  ERC20Input,
  TokenCreatorOutput,
  ERC721Input,
  VerifyInput,
  ERC1155Input,
  GetAbiInput,
  GetAbiOutput,
  GetPrivateKeyOutput,
  GetStealthAddressOutput,
  GetMarketOutput,
  GetUserOutput,
  RentMarketInput,
  GetPlaylistOutput,
  PlaylistInput,
  GetTopMarketOutput,
  GetHomeMarketOutput,
} from "./types";
type SuccessResponse<T> = {
  data: T;
  message: string;
  success: boolean;
  total: number;
};
const BASE_URL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001"
    : "https://api.scimta.com";

const axios = new Axios({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  transformResponse: [(data) => JSON.parse(data)],
  transformRequest: [
    (data, headers) => {
      if (headers && headers["Content-Type"] == "application/json") {
        return JSON.stringify(data);
      }
      return data;
    },
  ],
});

axios.interceptors.request.use((config) => {
  if (config.headers) {
    try {
      config.headers["authorize"] = `Music protocol:${localStorage.getItem(
        "signature"
      )}`;
    } catch (error: any) {}
  }
  return config;
});

const AxiosPost = <O>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return axios.post<SuccessResponse<O>, AxiosResponse<SuccessResponse<O>>>(
    url,
    data,
    config
  );
};

const AxiosGet = <O>(url: string, config?: AxiosRequestConfig) =>
  axios.get<SuccessResponse<O>, AxiosResponse<SuccessResponse<O>>>(url, config);

const ApiServices = {
  tokenCreator: {
    erc20: (payload: ERC20Input) =>
      AxiosPost<TokenCreatorOutput>("/token-creator/erc20", payload),
    erc721: (payload: ERC721Input) =>
      AxiosPost<TokenCreatorOutput>("/token-creator/erc721", payload),
    erc1155: (payload: ERC1155Input) =>
      AxiosPost<TokenCreatorOutput>("/token-creator/erc1155", payload),
    verify: (payload: VerifyInput) =>
      AxiosPost<boolean>("/token-creator/verify-contract", payload),
    abi: (payload: GetAbiInput) =>
      AxiosGet<GetAbiOutput>("/token-creator/abi", {
        params: payload,
      }),
  },
  stealthAddress: {
    submitPrivateKey: (privateKey: string, address: string) =>
      AxiosPost<boolean>("/stealth-address/submit-private-key", {
        privateKey,
        address,
      }),
    submitStealthAddress: (
      wallet_address: string,
      address: string,
      from: string
    ) =>
      AxiosPost<boolean>("/stealth-address/submit-stealth-address", {
        wallet_address,
        address,
        from,
      }),
    getPrivateKey: (address: string) =>
      AxiosGet<GetPrivateKeyOutput>("/stealth-address/get-private-key", {
        params: { address },
      }),
    getStealthAddress: (address: string) =>
      AxiosGet<GetStealthAddressOutput[]>(
        "/stealth-address/get-list-stealth-address",
        {
          params: { address },
        }
      ),
  },
  music: {
    getHomeMarket: () => AxiosGet<GetHomeMarketOutput[]>("/market/home-market"),
    getListMarket: (
      search: string = "",
      page: number = 1,
      limit: number = 24,
      genre: string = ""
    ) =>
      AxiosGet<GetMarketOutput[]>("/market/list-market", {
        params: {
          search,
          page,
          limit,
          genre,
        },
      }),
    getMusic: (id: string) =>
      AxiosGet<GetMarketOutput>("/market/music", {
        params: {
          id,
        },
      }),
    getMyCollection: (
      page: number = 1,
      limit: number = 24,
      search: string = ""
    ) =>
      AxiosGet<GetMarketOutput[]>("/music/list-song", {
        params: {
          page,
          limit,
          search,
        },
      }),
    getMyMarket: (address: string, page: number = 1, limit: number = 24) =>
      AxiosGet<GetMarketOutput[]>("/market/list-my-market", {
        params: {
          address,
          page,
          limit,
        },
      }),
    getNextId: () => AxiosGet<number>("/market/next-id"),
    getTopMarket: () => AxiosGet<GetTopMarketOutput>("/market/top-market"),
    viewMusic: (id: string) =>
      AxiosPost<boolean>("/music/view-song", {
        id,
      }),
    playMusic: (id: string) =>
      AxiosPost<boolean>("/music/play-song", {
        id,
      }),
  },
  renting: {
    erc4907: (payload: ERC721Input) =>
      AxiosPost<TokenCreatorOutput>("renting/erc4907", payload),
    rentMarket: (payload: RentMarketInput) =>
      AxiosPost<TokenCreatorOutput>("renting/rent-market", payload),
  },
  user: {
    getUser: (address: string) =>
      AxiosGet<GetUserOutput>("/user/get-user", {
        params: {
          address,
        },
      }),
    createUser: (payload: any) =>
      AxiosPost<GetUserOutput>("/user/create-user", payload),
  },
  ipfs: {
    uploadImage: (payload: any) =>
      AxiosPost<string>("/ipfs/upload-image", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    uploadJson: (payload: any) =>
      AxiosPost<string>("/ipfs/upload-json", payload),
  },
  playlist: {
    createPlaylist: (payload: PlaylistInput) =>
      AxiosPost<GetPlaylistOutput>("/playlist/playlist", payload),
    deletePlaylist: (payload: { id: string }) =>
      AxiosPost<GetPlaylistOutput>("/playlist/delete-playlist", payload),
    getPlaylist: (id: string) =>
      AxiosGet<GetPlaylistOutput>("/playlist/playlist", {
        params: {
          id,
        },
      }),
    getListPlaylist: () =>
      AxiosGet<GetPlaylistOutput[]>("/playlist/list-playlist"),
  },
};

export default ApiServices;
