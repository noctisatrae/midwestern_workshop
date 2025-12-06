/*
If you get data like this:

```
{
  salt: 1397930415398n,
  maker: "0xbD3674089Bb0C2E7D42B91f386DD971A5B09b914",
  signer: "0xbD3674089Bb0C2E7D42B91f386DD971A5B09b914",
  taker: "0x0000000000000000000000000000000000000000",
  tokenId: 33945469250963963541781051637999677727672635213493648594066577298999471399137n,
  makerAmount: 1000000n,
  takerAmount: 868000n,
  expiration: 0n,
  nonce: 0n,
  feeRateBps: 0n,
  side: 1,
  signatureType: 0,
  signature: "0x08d1bb1e746533dbaf6b7136a6cc885129665fcb503bdb40f652f4e4209ef8451f14505fcc109648244e428fae143045e97ef2843e9dbb323a1c7dddd26da1031c",
},
```

Some of those values might not make any sense like `side` or `signatureType` ; if you have access to the contract source code,
you can probably figure it out. Here's an example:

https://github.com/Polymarket/ctf-exchange/blob/1354de68752a065b7af8c0b004aeba2b16cf25a1/src/exchange/libraries/OrderStructs.sol#L50

Don't be afraid to dig very deep for information you need to correctly define your types, it's time well-spent
and you won't need as many therapy sessions to recover from production trauma.
*/

export enum OrderSide {
    // 0: BUY
    BUY = 0,
    // 1: SELL
    SELL = 1,
}

enum OrderSignatureType {
    // 0: ECDSA EIP712 signatures signed by EOAs
    EOA = 0,
    // 1: EIP712 signatures signed by EOAs that own Polymarket Proxy wallets
    POLY_PROXY = 1,
    // 2: EIP712 signatures signed by EOAs that own Polymarket Gnosis safes
    POLY_GNOSIS_SAFE = 2,
    // 3: EIP1271 signatures signed by smart contracts. To be used by smart contract wallets or vaults
    POLY_1271 = 3,
}

/**
 * I present to you JSONDoc, the thing that can make the difference between success
 * and burnout lol ; if you hover the function name, you will see my nice text as
 * beautiful documentation.
 */
export interface MatchOrderArgs {
    salt: bigint;
    maker: string;
    signer: string;
    /**
     * Who is interacting with the market?
     */
    taker: string;
    /**
     * What is the user willing to use to make a trade with this asset (0n when buying; USDC -> Token; BigInt when buying; Token -> USDC)
     */
    tokenId: bigint;
    /**
     * Are they selling or buying?
     */
    side: OrderSide;
    makerAmount: bigint;
    takerAmount: bigint;
    // The rest here is kinda useless for me ngl
    expiration: bigint;
    nonce: bigint;
    feeRateBps: bigint;
    signatureType: OrderSignatureType;
    signature: string;
}

export interface FilledOrder {
    takerOrderHash: string;
    takerOrderMaker: string;
    makerAssetId: bigint;
    takerAssetId: bigint;
    makerAmountFilled: bigint;
    takerAmountFilled: bigint;
}
