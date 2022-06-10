// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { json } = require("hardhat/internal/core/params/argumentTypes");
const xlsx = require('node-xlsx');

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

async function main() {
  // This is just a convenience check
  // if (network.name === "hardhat") {
  //   console.warn(
  //     "You are trying to deploy a contract to the Hardhat Network, which" +
  //       "gets automatically created and destroyed every time. Use the Hardhat" +
  //       " option '--network localhost'"
  //   );PaymentSplitter
  // }

  let obj = xlsx.parse(__dirname + '/address.xlsx'); // parses a file


let addresses  = obj[0].data
let arr = []
let investment = []

console.log(addresses[0][1])

for (let index = 0; index < 100; index++) {
    try {
        if(!arr.includes(addresses[index].toString())){
            console.log(index)
        let address = ethers.utils.getAddress(addresses[index][0].toString())
        let invest =  addresses[index][1]
        investment.push(invest)
        arr.push(address)
        console.log(address)
        }
    } catch (error) {
        console.log(error)
    }
    
}

  // ethers is avaialble in the global scope
  let starz_address = "0x08280c0e5038c26f775ff94A67466cc618aB3c3c"
  let Vesting
  let vesting
  const [deployer,per1,per2] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  Vesting = await ethers.getContractFactory("Vesting")
    
  vesting = await Vesting.deploy(arr,investment,starz_address,0)
  await vesting.deployed()  
  console.log(vesting.address)
  

    
  saveFrontendFiles(vesting)
   

}

function saveFrontendFiles(vesting) {
  const fs = require("fs");
  const contractsDir = "../frontend/src/contract";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  let config = `
 export const vesting_addr = "${vesting.address}"
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