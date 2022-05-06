// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { json } = require("hardhat/internal/core/params/argumentTypes");

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

async function main() {
  // This is just a convenience check
  // if (network.name === "hardhat") {
  //   console.warn(
  //     "You are trying to deploy a contract to the Hardhat Network, which" +
  //       "gets automatically created and destroyed every time. Use the Hardhat" +
  //       " option '--network localhost'"
  //   );
  // }

  // ethers is avaialble in the global scope
  let nFT
  let Bytes
  let bytes
  const [deployer,per1,per2] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  Bytes = await ethers.getContractFactory("Bytes")
    
  bytes = await Bytes.deploy()
  await bytes.deployed()  
  console.log(bytes.address)
  
  const DeltaTimeInventory = await ethers.getContractFactory("DeltaTimeInventory", {
      libraries: {
          Bytes: bytes.address,
      },
    });

    nFT = await DeltaTimeInventory.deploy("0x3B2FA3fB4c7eD3bC495F276DC60782b635bB04d9","0x3B2FA3fB4c7eD3bC495F276DC60782b635bB04d9")
    await nFT.deployed()

    
  saveFrontendFiles(nFT)
   

}

function saveFrontendFiles(nFT) {
  const fs = require("fs");
  const contractsDir = "../frontend/src/contract";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  let config = `
 export const zpad_addr = "${nFT.address}"
`

  let data = JSON.stringify(config)
  fs.writeFileSync(
    contractsDir + '/addresses.js', JSON.parse(data)

  );
  

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// npx hardhat run scripts\deploy.js --network rinkeby