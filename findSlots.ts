import { utils as eUtils, BigNumber, ethers } from "ethers";
import { BlockTag, Provider } from "@ethersproject/abstract-provider";
import { utils } from "@relicprotocol/client";

const NOUNS_ADDRESS = "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03";
const INFURA_ID = "5d19e896f00c4840bb5be686f31d8e0c";

//Sorry again for bringing all tha abi i will search a better way to do it
const contractAbi = [{"inputs":[{"internalType":"address","name":"_noundersDAO","type":"address"},{"internalType":"address","name":"_minter","type":"address"},{"internalType":"contract INounsDescriptor","name":"_descriptor","type":"address"},{"internalType":"contract INounsSeeder","name":"_seeder","type":"address"},{"internalType":"contract IProxyRegistry","name":"_proxyRegistry","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"DescriptorLocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract INounsDescriptor","name":"descriptor","type":"address"}],"name":"DescriptorUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"MinterLocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"minter","type":"address"}],"name":"MinterUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"NounBurned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"components":[{"internalType":"uint48","name":"background","type":"uint48"},{"internalType":"uint48","name":"body","type":"uint48"},{"internalType":"uint48","name":"accessory","type":"uint48"},{"internalType":"uint48","name":"head","type":"uint48"},{"internalType":"uint48","name":"glasses","type":"uint48"}],"indexed":false,"internalType":"struct INounsSeeder.Seed","name":"seed","type":"tuple"}],"name":"NounCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"noundersDAO","type":"address"}],"name":"NoundersDAOUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"SeederLocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract INounsSeeder","name":"seeder","type":"address"}],"name":"SeederUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"nounId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint96","name":"votes","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"dataURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"descriptor","outputs":[{"internalType":"contract INounsDescriptor","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isDescriptorLocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isMinterLocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isSeederLocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lockDescriptor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lockMinter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lockSeeder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"minter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"noundersDAO","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxyRegistry","outputs":[{"internalType":"contract IProxyRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"seeder","outputs":[{"internalType":"contract INounsSeeder","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"seeds","outputs":[{"internalType":"uint48","name":"background","type":"uint48"},{"internalType":"uint48","name":"body","type":"uint48"},{"internalType":"uint48","name":"accessory","type":"uint48"},{"internalType":"uint48","name":"head","type":"uint48"},{"internalType":"uint48","name":"glasses","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newContractURIHash","type":"string"}],"name":"setContractURIHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract INounsDescriptor","name":"_descriptor","type":"address"}],"name":"setDescriptor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_minter","type":"address"}],"name":"setMinter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_noundersDAO","type":"address"}],"name":"setNoundersDAO","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract INounsSeeder","name":"_seeder","type":"address"}],"name":"setSeeder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"votesToDelegate","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"}]


// SlotIndex is an index of storage slots we are interested in
export enum SlotIndex {
    // The storage slot of the mapping containing Nouns storage balance
    TokenBalance = 4,
    // The storage slot of the mapping containing Nouns delegate addresses
    Delegatee = 11,
    // The storage slot of the outermap
    OwnedTokens = 7,
}

export type NounsArt = {
    svg: string;
    id: BigNumber;
};

export type StorageSlotBatch = {
    block: BlockTag;
    address: string;
    slots: string[];
    values: string[];
    art: NounsArt[];
};

export class Storage {
    // Ethers provider
    private _provider: Provider = new ethers.providers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/${INFURA_ID}`
        );;
        // The Nouns token address
    private _tokenAddress: string = NOUNS_ADDRESS;
    // The nouns contract
    private _contract : ethers.Contract = new ethers.Contract(NOUNS_ADDRESS,contractAbi,this._provider)
        
        constructor() {
            const fn = async () => {
                this._provider;
                this._tokenAddress;
                this._contract ;
            };
            
            fn();
        }
        
  // getStorageValues build a storage slot request for a given address and block
  async getStorageValues(addr: string, b: BlockTag): Promise<StorageSlotBatch> {
    // nouns token balance at block
    const tbSlot = utils.mapElemSlot(SlotIndex.TokenBalance, addr).toHexString();
    const tbStorage = await this._provider.getStorageAt(this._tokenAddress, tbSlot, b);
    const tbValue = eUtils.hexZeroPad(BigNumber.from(tbStorage).toHexString(), 32);

    // nouns delegatee at block
    const dSlot = utils.mapElemSlot(SlotIndex.Delegatee, addr).toHexString();
    const dStorage = await this._provider.getStorageAt(this._tokenAddress, dSlot, b);
    const dValue = eUtils.hexZeroPad(BigNumber.from(dStorage).toHexString(), 32);

    //getting the slot number of the inner mapping of _ownedTokens (mapping address => innerMapping(uint => uint))
    const innerMapSlot =  utils.mapElemSlot(SlotIndex.OwnedTokens, addr).toHexString();
    //I read the contract and balanceOf is always +1 bigger than the mapping key, I tried with the initial balanceOf Token but it didn't work
    let innerKey = parseInt(tbValue,16) - 1;
    //uris is just to store all the tokens uris
    const uris : NounsArt[] = [];
    //Getting the slots of the values of the innerMapping (innerMaping uint => uint2) (getting slot Num of uint2)
    for (innerKey; innerKey>= 0; innerKey--){
        const innerMapValueSlot = utils.mapElemSlot(BigNumber.from(innerMapSlot), innerKey).toHexString();
        //Getting the value of uint2
        const innerMapStorgeValue = await this._provider.getStorageAt(this._tokenAddress, BigNumber.from(innerMapValueSlot ), b);
        const innerMapValue = eUtils.hexZeroPad(BigNumber.from(innerMapStorgeValue).toHexString(),32);
        //Getting the uri from tokenURI function and pushing them to the array
        const uri = await this._contract.tokenURI(innerMapValue);
        uris.push(uri)
    }
    /*
      TODO
      
      *NOTE* Above are 2 examples of how to get storage values from a contract.
      Read the following and then the above will make more sense.

      ----

      We need to get the noun ids owned by an address at any given block. Because 
      calling a smart contract will only return the current state of the blockchain
      we need another way to access historical data. Luckily archive nodes store
      the complete history of the blockchain, so if we connect to one we will be
      able to read data directly from storage. (you can use a free infura account)

      Here's the documentation on how data is laid out in storage: 
      https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html

      You can also watch this youtube video for a more guided explanation:
      https://www.youtube.com/watch?v=Gg6nt3YW74o&list=PLPrV9CBEjHY3VTflDoDkYGqSGrn_wdIw6&index=1&t=1s
      
      - tokenOwnerByIndex() defined in ERC721Enumerable [0] is used to get the noun ids owned by an address
        - this function reads data stored in the following mapping
          mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

        - your goal is to get the token id of each value stored in this mapping
          for an address at a given block. if an address owns 3 tokens, you should
          be able to get the ids of all 3 of them

        - you will use these ids to get the svg data returned from tokenURI(). when getting
          the svg data, you don't need to read historical data from slots. the data
          is available in the current state of the chain

      [0]: https://github.com/nounsDAO/nouns-monorepo/blob/master/packages/nouns-contracts/contracts/base/ERC721Enumerable.sol
    */

    return {
      block: b,
      address: NOUNS_ADDRESS,
      slots: [tbSlot, dSlot],
      values: [tbValue, dValue],
      art: uris, // TODO :- add this
    };
  }
}

const explorer = new Storage();

explorer.getStorageValues("0xFa4FC4ec2F81A4897743C5b4f45907c02ce06199",16862175);