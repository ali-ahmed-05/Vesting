const hre = require("hardhat");
const xlsx = require('node-xlsx');

async function main() {

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

await hre.run("verify:verify", {
    address: "0x8B3C06be33E0A38998a63b0d1CEfae11425cC9c7",
    constructorArguments: [
       arr,investment,"0x08280c0e5038c26f775ff94A67466cc618aB3c3c",0
    ],
  });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });