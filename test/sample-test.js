const { expect } = require("chai");
const { ethers } = require("hardhat");


async function mineNBlocks(n) {
  for (let index = 0; index < n; index++) {
    await ethers.provider.send('evm_mine');
  }
}

describe("DeltaTimeInventory ",  function ()  {

  
  let DeltaTimeInventory
  let nFT
  let Bytes
  let bytes




   let [_,per1,per2,per3] = [1,1,1,1]

  it("Should deploy all smart contracts", async function () {

    [_,per1,per2,per3] = await ethers.getSigners()
    
    Bytes = await ethers.getContractFactory("Bytes")
    
    bytes = await Bytes.deploy()
    await bytes.deployed()  
    console.log(bytes.address)
    
    const DeltaTimeInventory = await ethers.getContractFactory("DeltaTimeInventory", {
        libraries: {
            Bytes: bytes.address,
        },
      });

      nFT = await DeltaTimeInventory.deploy(per1.address,per2.address)
      await nFT.deployed()

  });
  
 
  it("Should create collection", async function () {
    
    //let _value = await ethers.utils.parseEther('5')
    let shortHexString = '0x0'
    const padded = ethers.utils.hexZeroPad(shortHexString, 32)
    console.log(padded)
    let create = await nFT.createCollection(1 , padded)
    await create.wait()
   
    // let mint = await nFT.mintNonFungible(_.address,1,padded,true)
    // await mint.wait()
   // let id = ethers.BigNumber.from(57901379749464006819045769421425668155141605180643517296703224736148279551033);
    let id = ethers.BigNumber.from("57901379749464006819045769421425668155141605180643517296703224736148279551033");
    let isNFT = false //change to internal 1168
    while (isNFT == false) {
        isNFT = await nFT.isNFT(id)
        id.add(1)
        console.log(isNFT)
    }

    console.log("id",id)

    let mint = await nFT.mintNonFungible(_.address,id,padded,true)
    await mint.wait()

    let uri = await nFT.tokenURI(id)


   
    console.log("uri",uri)
  });

  

});
// car 57897811546602716154061772833067606043877938695858166738530666139686417749824
// tyre 57904892738354523216013573712159567161076965227031377303628368365102569641296