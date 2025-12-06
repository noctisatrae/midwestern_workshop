import type { TypedDataDomain, TypedDataParameter } from "viem";
import { polygon } from "viem/chains";

const CTF_EXCHANGE = "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E" as const;
const NEG_RISK_CTF_EXCHANGE =
    "0xC5d563A36AE78145C45a50134d48A1215220f80a" as const;

const getPolymarketEIP712Domain = (isNegRisk: boolean) => ({
    chainId: polygon.id,
    name: "Polymarket CTF Exchange",
    verifyingContract: isNegRisk ? NEG_RISK_CTF_EXCHANGE : CTF_EXCHANGE,
    version: "1",
});

// Okay you may be like "wtf is this", right now :D
// This is a way to describe the binary data structure of an order using
// blockhain type so viem can construct it for us and hash it.
//
// I wrote it by hand, didn't find any other way; again I did it by stealing
// code from the contract and adapting it to our needs. The secret is to:
//
// 1. read the standards and the doc: https://eips.ethereum.org/EIPS/eip-712
// 2. read the contract as best as you can (sprinkle a little bit of AI in there)
// 3. Don't be afraid to "steal" code as long as you respect the licenses and don't call it yours!
//    You learn a lot by stealing and modifying :D!
export const POLYMARKET_ORDER_TYPED_DATA: readonly TypedDataParameter[] = [
    { name: "salt", type: "uint256" },
    { name: "maker", type: "address" },
    { name: "signer", type: "address" },
    { name: "taker", type: "address" },
    { name: "tokenId", type: "uint256" },
    { name: "makerAmount", type: "uint256" },
    { name: "takerAmount", type: "uint256" },
    { name: "expiration", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "feeRateBps", type: "uint256" },
    { name: "side", type: "uint8" },
    { name: "signatureType", type: "uint8" },
];

const NEG_RISK_CTF_EXCHANGE_ABI = [
    {
        inputs: [
            { internalType: "address", name: "_collateral", type: "address" },
            { internalType: "address", name: "_ctf", type: "address" },
            {
                internalType: "address",
                name: "_negRiskAdapter",
                type: "address",
            },
            { internalType: "address", name: "_proxyFactory", type: "address" },
            { internalType: "address", name: "_safeFactory", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyRegistered", type: "error" },
    { inputs: [], name: "FeeTooHigh", type: "error" },
    { inputs: [], name: "InvalidComplement", type: "error" },
    { inputs: [], name: "InvalidNonce", type: "error" },
    { inputs: [], name: "InvalidSignature", type: "error" },
    { inputs: [], name: "InvalidTokenId", type: "error" },
    { inputs: [], name: "MakingGtRemaining", type: "error" },
    { inputs: [], name: "MismatchedTokenIds", type: "error" },
    { inputs: [], name: "NotAdmin", type: "error" },
    { inputs: [], name: "NotCrossing", type: "error" },
    { inputs: [], name: "NotOperator", type: "error" },
    { inputs: [], name: "NotOwner", type: "error" },
    { inputs: [], name: "NotTaker", type: "error" },
    { inputs: [], name: "OrderExpired", type: "error" },
    { inputs: [], name: "OrderFilledOrCancelled", type: "error" },
    { inputs: [], name: "Paused", type: "error" },
    { inputs: [], name: "TooLittleTokensReceived", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "receiver",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "FeeCharged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "newAdminAddress",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "admin",
                type: "address",
            },
        ],
        name: "NewAdmin",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "newOperatorAddress",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "admin",
                type: "address",
            },
        ],
        name: "NewOperator",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "orderHash",
                type: "bytes32",
            },
        ],
        name: "OrderCancelled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "orderHash",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "maker",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "taker",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "makerAssetId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "takerAssetId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "makerAmountFilled",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "takerAmountFilled",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "fee",
                type: "uint256",
            },
        ],
        name: "OrderFilled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "takerOrderHash",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "takerOrderMaker",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "makerAssetId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "takerAssetId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "makerAmountFilled",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "takerAmountFilled",
                type: "uint256",
            },
        ],
        name: "OrdersMatched",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldProxyFactory",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newProxyFactory",
                type: "address",
            },
        ],
        name: "ProxyFactoryUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "removedAdmin",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "admin",
                type: "address",
            },
        ],
        name: "RemovedAdmin",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "removedOperator",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "admin",
                type: "address",
            },
        ],
        name: "RemovedOperator",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldSafeFactory",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newSafeFactory",
                type: "address",
            },
        ],
        name: "SafeFactoryUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "token0",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "token1",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "conditionId",
                type: "bytes32",
            },
        ],
        name: "TokenRegistered",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pauser",
                type: "address",
            },
        ],
        name: "TradingPaused",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pauser",
                type: "address",
            },
        ],
        name: "TradingUnpaused",
        type: "event",
    },
    {
        inputs: [{ internalType: "address", name: "admin_", type: "address" }],
        name: "addAdmin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "operator_", type: "address" },
        ],
        name: "addOperator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "admins",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "salt", type: "uint256" },
                    { internalType: "address", name: "maker", type: "address" },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    { internalType: "address", name: "taker", type: "address" },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    { internalType: "enum Side", name: "side", type: "uint8" },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    { internalType: "bytes", name: "signature", type: "bytes" },
                ],
                internalType: "struct Order",
                name: "order",
                type: "tuple",
            },
        ],
        name: "cancelOrder",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "salt", type: "uint256" },
                    { internalType: "address", name: "maker", type: "address" },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    { internalType: "address", name: "taker", type: "address" },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    { internalType: "enum Side", name: "side", type: "uint8" },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    { internalType: "bytes", name: "signature", type: "bytes" },
                ],
                internalType: "struct Order[]",
                name: "orders",
                type: "tuple[]",
            },
        ],
        name: "cancelOrders",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "domainSeparator",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "salt", type: "uint256" },
                    { internalType: "address", name: "maker", type: "address" },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    { internalType: "address", name: "taker", type: "address" },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    { internalType: "enum Side", name: "side", type: "uint8" },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    { internalType: "bytes", name: "signature", type: "bytes" },
                ],
                internalType: "struct Order",
                name: "order",
                type: "tuple",
            },
            { internalType: "uint256", name: "fillAmount", type: "uint256" },
        ],
        name: "fillOrder",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "salt", type: "uint256" },
                    { internalType: "address", name: "maker", type: "address" },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    { internalType: "address", name: "taker", type: "address" },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    { internalType: "enum Side", name: "side", type: "uint8" },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    { internalType: "bytes", name: "signature", type: "bytes" },
                ],
                internalType: "struct Order[]",
                name: "orders",
                type: "tuple[]",
            },
            {
                internalType: "uint256[]",
                name: "fillAmounts",
                type: "uint256[]",
            },
        ],
        name: "fillOrders",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getCollateral",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "token", type: "uint256" }],
        name: "getComplement",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "token", type: "uint256" }],
        name: "getConditionId",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCtf",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getMaxFeeRate",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "orderHash", type: "bytes32" },
        ],
        name: "getOrderStatus",
        outputs: [
            {
                components: [
                    {
                        internalType: "bool",
                        name: "isFilledOrCancelled",
                        type: "bool",
                    },
                    {
                        internalType: "uint256",
                        name: "remaining",
                        type: "uint256",
                    },
                ],
                internalType: "struct OrderStatus",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPolyProxyFactoryImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_addr", type: "address" }],
        name: "getPolyProxyWalletAddress",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getProxyFactory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_addr", type: "address" }],
        name: "getSafeAddress",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getSafeFactory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getSafeFactoryImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "salt", type: "uint256" },
                    { internalType: "address", name: "maker", type: "address" },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    { internalType: "address", name: "taker", type: "address" },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    { internalType: "enum Side", name: "side", type: "uint8" },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    { internalType: "bytes", name: "signature", type: "bytes" },
                ],
                internalType: "struct Order",
                name: "order",
                type: "tuple",
            },
        ],
        name: "hashOrder",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "incrementNonce",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "usr", type: "address" }],
        name: "isAdmin",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "usr", type: "address" }],
        name: "isOperator",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "usr", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
        ],
        name: "isValidNonce",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "salt", type: "uint256" },
                    { internalType: "address", name: "maker", type: "address" },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    { internalType: "address", name: "taker", type: "address" },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    { internalType: "enum Side", name: "side", type: "uint8" },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    { internalType: "bytes", name: "signature", type: "bytes" },
                ],
                internalType: "struct Order",
                name: "takerOrder",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "uint256", name: "salt", type: "uint256" },
                    { internalType: "address", name: "maker", type: "address" },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    { internalType: "address", name: "taker", type: "address" },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    { internalType: "enum Side", name: "side", type: "uint8" },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    { internalType: "bytes", name: "signature", type: "bytes" },
                ],
                internalType: "struct Order[]",
                name: "makerOrders",
                type: "tuple[]",
            },
            {
                internalType: "uint256",
                name: "takerFillAmount",
                type: "uint256",
            },
            {
                internalType: "uint256[]",
                name: "makerFillAmounts",
                type: "uint256[]",
            },
        ],
        name: "matchOrders",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "nonces",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
            { internalType: "uint256[]", name: "", type: "uint256[]" },
            { internalType: "uint256[]", name: "", type: "uint256[]" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "onERC1155BatchReceived",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "onERC1155Received",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "operators",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        name: "orderStatus",
        outputs: [
            { internalType: "bool", name: "isFilledOrCancelled", type: "bool" },
            { internalType: "uint256", name: "remaining", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "parentCollectionId",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "pauseTrading",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "paused",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "proxyFactory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "token", type: "uint256" },
            { internalType: "uint256", name: "complement", type: "uint256" },
            { internalType: "bytes32", name: "conditionId", type: "bytes32" },
        ],
        name: "registerToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "registry",
        outputs: [
            { internalType: "uint256", name: "complement", type: "uint256" },
            { internalType: "bytes32", name: "conditionId", type: "bytes32" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "admin", type: "address" }],
        name: "removeAdmin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "operator", type: "address" },
        ],
        name: "removeOperator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceAdminRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOperatorRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "safeFactory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_newProxyFactory",
                type: "address",
            },
        ],
        name: "setProxyFactory",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_newSafeFactory",
                type: "address",
            },
        ],
        name: "setSafeFactory",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
        ],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "unpauseTrading",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "token", type: "uint256" },
            { internalType: "uint256", name: "complement", type: "uint256" },
        ],
        name: "validateComplement",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "salt", type: "uint256" },
                    { internalType: "address", name: "maker", type: "address" },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    { internalType: "address", name: "taker", type: "address" },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    { internalType: "enum Side", name: "side", type: "uint8" },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    { internalType: "bytes", name: "signature", type: "bytes" },
                ],
                internalType: "struct Order",
                name: "order",
                type: "tuple",
            },
        ],
        name: "validateOrder",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "orderHash", type: "bytes32" },
            {
                components: [
                    { internalType: "uint256", name: "salt", type: "uint256" },
                    { internalType: "address", name: "maker", type: "address" },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    { internalType: "address", name: "taker", type: "address" },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    { internalType: "enum Side", name: "side", type: "uint8" },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    { internalType: "bytes", name: "signature", type: "bytes" },
                ],
                internalType: "struct Order",
                name: "order",
                type: "tuple",
            },
        ],
        name: "validateOrderSignature",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "validateTokenId",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
] as const;

const CTF_EXCHANGE_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_collateral",
                type: "address",
            },
            {
                internalType: "address",
                name: "_ctf",
                type: "address",
            },
            {
                internalType: "address",
                name: "_proxyFactory",
                type: "address",
            },
            {
                internalType: "address",
                name: "_safeFactory",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "AlreadyRegistered",
        type: "error",
    },
    {
        inputs: [],
        name: "FeeTooHigh",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidComplement",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidNonce",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidSignature",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidTokenId",
        type: "error",
    },
    {
        inputs: [],
        name: "MakingGtRemaining",
        type: "error",
    },
    {
        inputs: [],
        name: "MismatchedTokenIds",
        type: "error",
    },
    {
        inputs: [],
        name: "NotAdmin",
        type: "error",
    },
    {
        inputs: [],
        name: "NotCrossing",
        type: "error",
    },
    {
        inputs: [],
        name: "NotOperator",
        type: "error",
    },
    {
        inputs: [],
        name: "NotOwner",
        type: "error",
    },
    {
        inputs: [],
        name: "NotTaker",
        type: "error",
    },
    {
        inputs: [],
        name: "OrderExpired",
        type: "error",
    },
    {
        inputs: [],
        name: "OrderFilledOrCancelled",
        type: "error",
    },
    {
        inputs: [],
        name: "Paused",
        type: "error",
    },
    {
        inputs: [],
        name: "TooLittleTokensReceived",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "receiver",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "FeeCharged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "newAdminAddress",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "admin",
                type: "address",
            },
        ],
        name: "NewAdmin",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "newOperatorAddress",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "admin",
                type: "address",
            },
        ],
        name: "NewOperator",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "orderHash",
                type: "bytes32",
            },
        ],
        name: "OrderCancelled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "orderHash",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "maker",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "taker",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "makerAssetId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "takerAssetId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "makerAmountFilled",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "takerAmountFilled",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "fee",
                type: "uint256",
            },
        ],
        name: "OrderFilled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "takerOrderHash",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "takerOrderMaker",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "makerAssetId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "takerAssetId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "makerAmountFilled",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "takerAmountFilled",
                type: "uint256",
            },
        ],
        name: "OrdersMatched",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldProxyFactory",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newProxyFactory",
                type: "address",
            },
        ],
        name: "ProxyFactoryUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "removedAdmin",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "admin",
                type: "address",
            },
        ],
        name: "RemovedAdmin",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "removedOperator",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "admin",
                type: "address",
            },
        ],
        name: "RemovedOperator",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldSafeFactory",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newSafeFactory",
                type: "address",
            },
        ],
        name: "SafeFactoryUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "token0",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "token1",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "conditionId",
                type: "bytes32",
            },
        ],
        name: "TokenRegistered",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pauser",
                type: "address",
            },
        ],
        name: "TradingPaused",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pauser",
                type: "address",
            },
        ],
        name: "TradingUnpaused",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "admin_",
                type: "address",
            },
        ],
        name: "addAdmin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "operator_",
                type: "address",
            },
        ],
        name: "addOperator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "admins",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "salt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "maker",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "taker",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    {
                        internalType: "enum Side",
                        name: "side",
                        type: "uint8",
                    },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                ],
                internalType: "struct Order",
                name: "order",
                type: "tuple",
            },
        ],
        name: "cancelOrder",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "salt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "maker",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "taker",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    {
                        internalType: "enum Side",
                        name: "side",
                        type: "uint8",
                    },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                ],
                internalType: "struct Order[]",
                name: "orders",
                type: "tuple[]",
            },
        ],
        name: "cancelOrders",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "domainSeparator",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "salt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "maker",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "taker",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    {
                        internalType: "enum Side",
                        name: "side",
                        type: "uint8",
                    },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                ],
                internalType: "struct Order",
                name: "order",
                type: "tuple",
            },
            {
                internalType: "uint256",
                name: "fillAmount",
                type: "uint256",
            },
        ],
        name: "fillOrder",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "salt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "maker",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "taker",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    {
                        internalType: "enum Side",
                        name: "side",
                        type: "uint8",
                    },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                ],
                internalType: "struct Order[]",
                name: "orders",
                type: "tuple[]",
            },
            {
                internalType: "uint256[]",
                name: "fillAmounts",
                type: "uint256[]",
            },
        ],
        name: "fillOrders",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getCollateral",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "token",
                type: "uint256",
            },
        ],
        name: "getComplement",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "token",
                type: "uint256",
            },
        ],
        name: "getConditionId",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCtf",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getMaxFeeRate",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "orderHash",
                type: "bytes32",
            },
        ],
        name: "getOrderStatus",
        outputs: [
            {
                components: [
                    {
                        internalType: "bool",
                        name: "isFilledOrCancelled",
                        type: "bool",
                    },
                    {
                        internalType: "uint256",
                        name: "remaining",
                        type: "uint256",
                    },
                ],
                internalType: "struct OrderStatus",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPolyProxyFactoryImplementation",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_addr",
                type: "address",
            },
        ],
        name: "getPolyProxyWalletAddress",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getProxyFactory",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_addr",
                type: "address",
            },
        ],
        name: "getSafeAddress",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getSafeFactory",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getSafeFactoryImplementation",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "salt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "maker",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "taker",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    {
                        internalType: "enum Side",
                        name: "side",
                        type: "uint8",
                    },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                ],
                internalType: "struct Order",
                name: "order",
                type: "tuple",
            },
        ],
        name: "hashOrder",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "incrementNonce",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "usr",
                type: "address",
            },
        ],
        name: "isAdmin",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "usr",
                type: "address",
            },
        ],
        name: "isOperator",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "usr",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
            },
        ],
        name: "isValidNonce",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "salt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "maker",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "taker",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    {
                        internalType: "enum Side",
                        name: "side",
                        type: "uint8",
                    },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                ],
                internalType: "struct Order",
                name: "takerOrder",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "salt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "maker",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "taker",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    {
                        internalType: "enum Side",
                        name: "side",
                        type: "uint8",
                    },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                ],
                internalType: "struct Order[]",
                name: "makerOrders",
                type: "tuple[]",
            },
            {
                internalType: "uint256",
                name: "takerFillAmount",
                type: "uint256",
            },
            {
                internalType: "uint256[]",
                name: "makerFillAmounts",
                type: "uint256[]",
            },
        ],
        name: "matchOrders",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "nonces",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
            },
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "onERC1155BatchReceived",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "onERC1155Received",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "operators",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        name: "orderStatus",
        outputs: [
            {
                internalType: "bool",
                name: "isFilledOrCancelled",
                type: "bool",
            },
            {
                internalType: "uint256",
                name: "remaining",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "parentCollectionId",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "pauseTrading",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "paused",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "proxyFactory",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "token",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "complement",
                type: "uint256",
            },
            {
                internalType: "bytes32",
                name: "conditionId",
                type: "bytes32",
            },
        ],
        name: "registerToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "registry",
        outputs: [
            {
                internalType: "uint256",
                name: "complement",
                type: "uint256",
            },
            {
                internalType: "bytes32",
                name: "conditionId",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "admin",
                type: "address",
            },
        ],
        name: "removeAdmin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
        ],
        name: "removeOperator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceAdminRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOperatorRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "safeFactory",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_newProxyFactory",
                type: "address",
            },
        ],
        name: "setProxyFactory",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_newSafeFactory",
                type: "address",
            },
        ],
        name: "setSafeFactory",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
            },
        ],
        name: "supportsInterface",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "unpauseTrading",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "token",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "complement",
                type: "uint256",
            },
        ],
        name: "validateComplement",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "salt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "maker",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "taker",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    {
                        internalType: "enum Side",
                        name: "side",
                        type: "uint8",
                    },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                ],
                internalType: "struct Order",
                name: "order",
                type: "tuple",
            },
        ],
        name: "validateOrder",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "orderHash",
                type: "bytes32",
            },
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "salt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "maker",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "signer",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "taker",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "makerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "takerAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "expiration",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "feeRateBps",
                        type: "uint256",
                    },
                    {
                        internalType: "enum Side",
                        name: "side",
                        type: "uint8",
                    },
                    {
                        internalType: "enum SignatureType",
                        name: "signatureType",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                ],
                internalType: "struct Order",
                name: "order",
                type: "tuple",
            },
        ],
        name: "validateOrderSignature",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "validateTokenId",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
] as const;

export {
    CTF_EXCHANGE_ABI,
    NEG_RISK_CTF_EXCHANGE_ABI,
    getPolymarketEIP712Domain,
};
