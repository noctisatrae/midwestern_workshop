import { getRpc } from "./lib/getRpc";
import NEG_RISK_FEE_MODULE_ABI from "../assets/polymarket/negRiskFeeModule";
import {
    decodeFunctionData,
    formatUnits,
    hashTypedData,
    parseEventLogs,
} from "viem";
import {
    OrderSide,
    type FilledOrder,
    type MatchOrderArgs,
} from "./types/polymarket";
import { CTF_EXCHANGE_ABI } from "../assets/polymarket/ctfExchange";
import CONDITIONAL_TOKEN_ABI from "../assets/polymarket/conditionalToken";
import computeOrderHash from "./lib/computeOrderHash";
import {
    determineRelevantAssetAndAmount,
    determineSharePrice,
} from "./lib/calculations";
import { fetchMarkets } from "./lib/fetchMarkets";

const polygonRpc = getRpc();

const INTERESTING_TRANSACTION =
    "0x042d846dd0d935f3d15a195fdbee95a728b7f43c7784b13135bf622a540a0a00";

// This functions calls the RPC (remote-procedure call):
// https://ethereum.org/developers/docs/apis/json-rpc/#eth_getTransactionByHash
//
// tip: use the documentation/hover your mouse over a function to see which endpoint
// it is gonna call.
//
// - First promise, we get the transaction from polygon
// - Second promise, we ask for the "receipts", confirmation / logs / events
const [tx, receipt] = await Promise.all([
    polygonRpc.getTransaction({
        hash: INTERESTING_TRANSACTION,
    }),
    polygonRpc.getTransactionReceipt({
        hash: INTERESTING_TRANSACTION,
    }),
]);

/*
Personally the only way I can make sense of functions arguments is by reading the contract source code.
Polymarket's CTFExchange is available on github at:

https://github.com/Polymarket/ctf-exchange/blob/1354de68752a065b7af8c0b004aeba2b16cf25a1/src/exchange/mixins/Trading.sol#L132

And we can see that the function signature is:

```
/// @notice Matches orders against each other
/// Matches a taker order against a list of maker orders
/// @param takerOrder       - The active order to be matched
/// @param makerOrders      - The array of passive orders to be matched against the active order
/// @param takerFillAmount  - The amount to fill on the taker order, in terms of the maker amount
/// @param makerFillAmounts - The array of amounts to fill on the maker orders, in terms of the maker amount
function _matchOrders(
    Order memory takerOrder,
    Order[] memory makerOrders,
    uint256 takerFillAmount,
    uint256[] memory makerFillAmounts
) internal
```

We know the arity of the function (number of arguments) which is going the length of the `functionArgs` array.
We know the order of the arguments; so let's we want to know what the taker (e.g our user) **wanted** to do.

NOTE: I insist on the "want" because this is **input** data, which means we ask something of the contract!
It's not what actually happened; for that we will parse the event logs, more on that later!

Index is 0 takerOrder
*/
const { args: functionArgs } = decodeFunctionData({
    abi: NEG_RISK_FEE_MODULE_ABI,
    data: tx.input,
});
if (!functionArgs)
    throw new Error("No function arguments found, cannot decode order");

const decodedData = functionArgs[0];
if (!decodedData) throw new Error("Invalid args, cannot find anything");

// WAIT! This is unsafe; in a real production scenario, you should validate the data before using it.
// `as` in TypeScript means that we're coercing the compiler to label `parsed` as a certain shape.
// It might be different, and then you're fucked at runtime because you're trying to access a property
// that is undefined, and BAM! You get runtime errors; stay safe out there by using:
//
// - https://zod.dev/
//
// If you want to build a working app in crypto, you need to invest time in correctly defining the object
// you're working with or you'll get fucked later down the road and have to refactor. Do it now,
// or die in pain later ehehehehe
const order = decodedData as MatchOrderArgs;

console.debug("USER's ORDER", order);

const ctLogs = parseEventLogs({
    abi: CONDITIONAL_TOKEN_ABI,
    logs: receipt.logs,
});

// - 0x string are just bytestring: they're a nice way of representing hex data
// - polymarket's triggers the function, you can understand the transaction from one party's
//   perspective; in our case, we're gonna focus on the user!!
// - allowance from the polymarket contract
// - what is an (offchain) orderbook
//     - actors within the market
//     - why it's a good design to have an hybrid architecture

// How do we map the order of the taker to the actual event that happened on the blockchain?
// This paradigm of market has horrible semantics, I've been working for a while on this now
// and I still feel like my underatanding of the semantics, and involved parties is shaky.
// I feel like it helps a lot to go from the user's perspective to understand what is
// happening and frame it as a conversation.
//
// First, let's clarify what maker/taker ACTUALLY means:
// - MAKER: Someone who "makes" liquidity by placing a passive order on the book and waiting.
// - TAKER: Someone who "takes" liquidity by aggressively matching against existing orders.
//
// In this transaction, your user is the TAKER! They're the one submitting the transaction
// and actively consuming orders that were sitting on the book. Don't let the `maker` field
// in the order struct confuse you - that's just who owns/signed the order, not their role!
//
// Imagine the order of your user, as the transaction currently analyzed is:
//
// {
//   salt: 903466283942n,
//   maker: "0xbD3674089Bb0C2E7D42B91f386DD971A5B09b914",  // This is the order's OWNER, not the market role!
//   signer: "0xbD3674089Bb0C2E7D42B91f386DD971A5B09b914",
//   taker: "0x0000000000000000000000000000000000000000",  // 0x0 means "anyone can fill this"
//   tokenId: 97503642261724785867170248516772631906389718468911934099041617819193390684815n,
//   makerAmount: 1000000n,
//   takerAmount: 1282000n,
//   expiration: 0n,
//   nonce: 0n,
//   feeRateBps: 0n,
//   side: 0,
//   signatureType: 0,
//   signature: "0x2a86c1d7ea2031f5bdb0af573c2ccd09063efbbb72e4fdb41f4bf92efb5cbfcd55ab1f5a163b9a169c906d6782a471730e475353623f5ed7d5e9b6a8d42db90a1c",
// }
//
// Your user (the TAKER) walks into the market and says:
// - Hello market! I want to BUY (side is 0) this `tokenId` (right now!)
//   I am willing to put $1 to get 1.28 shares of this position!
//   Match me against whatever makers are out there!
//
// The exchange finds passive maker orders sitting on the book and matches them.
// Here's what the event looks like after execution:
//
// [EVENT: OrdersMatched]
// {
//     orderHash: "0x0364d83c9484c691e361da17422b5385c886b4eb9e2af5081e02659496127f24",
//     takerOrderMaker: "0xbD3674089Bb0C2E7D42B91f386DD971A5B09b914", // YOU! (owner of the taker order)
//     makerOrderMaker: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E", // The passive maker who was waiting
//     takerAssetId: 0n, // What you (taker) gave away - USDC.e
//     makerAssetId: 97503642261724785867170248516772631906389718468911934099041617819193390684815n, // What you received - outcome tokens
//     takerAmountFilled: 999999n, // How much USDC.e you spent
//     makerAmountFilled: 1298700n, // How many outcome tokens you got (yeah rob'em!)
//     fee: 0n, // polymarket's cut
// }
//
// TAKER (you): - Hello I am the taker! Here's my $1, gimme shares
//              [YOU spent 999999n USDC.e]
// MAKER:       - *was waiting with a limit order* Oh someone wants my shares? Sure, here you go.
//              [MAKER gave you 1298700n of the outcome token]
//
// Mainly what helps identify that this is your order's fullfilment is that the orderHash are matching.
// I am gonna show you to compute this, it's pretty hard but we can do it, and it's a method to
// guarentee a match!

const ctfExchangeLogs = parseEventLogs({
    abi: CTF_EXCHANGE_ABI,
    logs: receipt.logs,
});

const orderHash = computeOrderHash(order);
const matchEvent = ctfExchangeLogs.find(
    (l) =>
        l.eventName === "OrdersMatched" && l.args.takerOrderHash === orderHash,
);
if (!matchEvent) {
    console.debug(ctfExchangeLogs);
    throw new Error(`No OrdersMatched found - order hash is ${orderHash}`);
}

const filledOrder = matchEvent.args as FilledOrder; // again this is unsafe, you should validate the data
const shorten = (lstr: string) =>
    `${lstr.substring(0, 10)}...${lstr.substring(lstr.length - 10)}`;

const { assetId, amount } = determineRelevantAssetAndAmount(
    order.side,
    filledOrder,
);

console.debug("FOUND ORDER COMPLETION", matchEvent);

const market = await fetchMarkets(assetId);

console.debug(
    `\nUser (${shorten(filledOrder.takerOrderMaker)}) ${order.side === OrderSide.BUY ? "bought" : "sold"} ${formatUnits(amount, 6)} shares of asset (name: ${market.outcomes.get(String(assetId))} - id: ${shorten(String(assetId))}) at $${determineSharePrice(order.side, filledOrder)}`,
);
