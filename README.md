# Decentralized Ethereum Lottery Next.js

This is a frontend part of Decentralized Ethereum Lottery project. You can find the other part in the [Hardhat Repo](https://github.com/v7m/decentralized-lottery-hardhat).


Ethereum Smart Contract Address (Sepolia chain): [0xe59A431759a5a3C270Bba717C1E3dA350f090df4](https://sepolia.etherscan.io/address/0xe59A431759a5a3C270Bba717C1E3dA350f090df4)

[Deployed App](https://fancy-dream-3458.on.fleek.co/)

[Deployed App IPFS](ipfs://Qme4KacFx21y6pYuTC6veAU2usryXB3fNWqLkX3a2hMvDe)

<img src="img/readme-app.png" alt="image" width="500" height="auto">

## Built with:
- Solidity
- Chainlink
- Hardhat
- Ethers.js
- Next.js
- Moralis
- Web3UIKit
- IPFS

# Getting Started

```
git clone https://github.com/v7m/decentralized-lottery-nextjs.git
cd decentralized-lottery-nextjs
yarn
yarn dev
```

# Usage

1. Run your local blockchain with the code from [Hardhat Repo](https://github.com/v7m/decentralized-lottery-hardhat) in a different terminal

```
git clone https://github.com/v7m/decentralized-lottery-hardhat.git
cd decentralized-lottery-hardhat
yarn
yarn hardhat node
```

> You can read more about how to use that repo from its [README.md](https://github.com/v7m/decentralized-lottery-hardhat/blob/main/README.md)


2. Add Hardhat network to your Metamask/wallet

- Get the `RPC_URL` of your Hardhat node (usually `http://127.0.0.1:8545/`)
- Go to your wallet and add a new network. [See instructions here.](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC)
  - Network Name: `Hardhat-Localhost`
  - New RPC URL: `http://127.0.0.1:8545/`
  - Chain ID: `31337`
  - Currency Symbol: `ETH` (or `GO`)
  - Block Explorer URL: `None`

In an ideal scenario, you would [import one of the accounts](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account) from Hardhat into your wallet or MetaMask.

3. Run this code in a different terminal with the code from this repo

```
yarn dev
```

4. Navigate to the user interface (UI)

Open [localhost](http://localhost:3000) and try the lottery.

# Deploying to IPFS

1. Build your static code.

```
yarn build
```

2. Export your site

```
yarn next export
```

> Please be aware that Next.js and Moralis have certain non-static features. If you choose to deviate from this repository, you may encounter errors.

3. Deploy to IPFS using Fleek

[Fleek](https://fleek.co/) offers automatic deployment when connected to your GitHub repository.


# Linting

To check linting / code formatting:
```
yarn lint
```
