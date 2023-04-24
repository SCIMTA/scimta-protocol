import "dotenv/config";
import fs from "fs";
import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Contracts = [
    {
      name: "Secp256k1",
      args: [],
      path: "library",
    },
    {
      name: "StealthAddress",
      args: [],
      link: "Secp256k1",
      path: "stealth-address",
    },
  ];
  let contractDeployed:any = {};
  for (let i = 0; i < Contracts.length; i++) {
    const contract = Contracts[i];
    const contractFactory = await ethers.getContractFactory(contract.name, {
      ...(!!contract.link && {
        libraries: {
          [contract.link]: contractDeployed[contract.link].address,
        },
      }),
    });
    const deployContract = await contractFactory.deploy();
    await deployContract.deployed();

    const contractCompileFilePath = `../artifacts/contracts/${contract.path}/${contract.name}.sol/${contract.name}.json`;
    contractDeployed[contract.name] = {
      address: deployContract.address,
      abi: require(contractCompileFilePath).abi,
      contractName: require(contractCompileFilePath).contractName,
      path: contract.path,
    };
    console.log(
      `The contract ${
        contractDeployed[contract.name].contractName
      } has been deployed to: ${deployContract.address}`
    );
  }

  fs.writeFileSync(
    "./abi-stealth-address.json",
    JSON.stringify(contractDeployed)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
