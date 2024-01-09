# ERC-4337 Subscriptions: PoC

### Using a recurring payment plugin on a BiconomySmartAccount v2.

The `RecurringPaymentsModule` contract allows for a user to setup a subscription agreement using the `initForSmartAccount()` function. The `SubscriptionRouter` contract is responsible for receiving subscription payments using `extendSubscription()`. A `defaultOperator` address set on the router can execute extending the subscriptions on behalf of a smart account using `extendSubscriptionByOperator()`.

## Setup

- Clone repository and install dependencies

```bash
git clone https://github.com/JO-OLADEJI/erc4337-subscriptions.git
yarn install

# install deps for the PoC script
cd client
yarn install
```

- Create `.env` file in root folder and add your private key to deploy contracts

```bash
EOA_SIGNER = "0x<<your-private-key>>"
```

- Setup `defaultOperator` address for `SubscriptionRouter` in `./deploy-config.json`

- Compile and deploy contracts

```bash
yarn compile
yarn deploy
```

- Copy deployed contract addresses to `./data/addresses.json`

## PoC Script

- Create `.env` file in the `./client` folder and add the following private keys

```bash
# private key of EOA linked to smart account
EOA_SIGNER  =  "0x<<eoa-private-key>>"

# optional: private key of defaultOperator set on the SubscriptionRouter contract
# for extending a subscription agreement on behalf of smart account
ROUTER_DEFAULT_OPERATOR = "0x<<defaultOperator-private-key>>"
```

- Run PoC script

```bash
yarn start
```

## References

- [Biconomy docs](https://docs.biconomy.io/)
- [Recurring Payment Module github PR](https://github.com/bcnmy/scw-contracts/pull/176/files)
- [ERC-4337](https://www.erc4337.io/)
- [EIP-6900](https://eips.ethereum.org/EIPS/eip-6900)
