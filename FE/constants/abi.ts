export const ABI = {
  Secp256k1: {
    address: "0x6902BaEd66AaFDFD81574fbe4dFe10E7b154afE5",
    abi: [
      {
        inputs: [{ internalType: "uint256", name: "privKey", type: "uint256" }],
        name: "derivePubKey",
        outputs: [
          { internalType: "uint256", name: "", type: "uint256" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "privKey", type: "uint256" }],
        name: "deriveAddress",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "privKeyBob",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pubKeyAliceX",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pubKeyAliceY",
            type: "uint256",
          },
        ],
        name: "getStealAddress",
        outputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "bytes", name: "", type: "bytes" },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "privKey", type: "uint256" },
          { internalType: "uint256", name: "hashS", type: "uint256" },
        ],
        name: "getPrivateKeyOfStealAddress",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "pure",
        type: "function",
      },
    ],
    contractName: "Secp256k1",
    path: "library",
  },
  StealAddress: {
    address: "0xDB1577c0b4E0099cDe57dF1A9bFE42CF53566901",
    abi: [
      {
        inputs: [
          { internalType: "uint256", name: "x", type: "uint256" },
          { internalType: "uint256", name: "y", type: "uint256" },
        ],
        name: "setPublicKey",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_address", type: "address" },
        ],
        name: "getPublicKey",
        outputs: [
          {
            components: [
              { internalType: "uint256", name: "X", type: "uint256" },
              { internalType: "uint256", name: "Y", type: "uint256" },
            ],
            internalType: "struct PublicKey",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "privKey", type: "uint256" }],
        name: "privToPubKey",
        outputs: [
          { internalType: "uint256", name: "", type: "uint256" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "privKey", type: "uint256" },
          { internalType: "address", name: "to_address", type: "address" },
        ],
        name: "getStealAddress",
        outputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "bytes", name: "", type: "bytes" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "privKey", type: "uint256" },
          { internalType: "uint256", name: "hash", type: "uint256" },
        ],
        name: "getPrivateKeyOfStealAddress",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "pure",
        type: "function",
      },
    ],
    contractName: "StealAddress",
    path: "steal-address",
  },
};
