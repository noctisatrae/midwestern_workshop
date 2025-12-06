import { hashTypedData } from "viem";
import type { MatchOrderArgs } from "../types/polymarket";
import {
    getPolymarketEIP712Domain,
    POLYMARKET_ORDER_TYPED_DATA,
} from "../../assets/polymarket/ctfExchange";

const computeOrderHash = (order: MatchOrderArgs): `0x${string}` => {
    // https://github.com/Polymarket/ctf-exchange/blob/1354de68752a065b7af8c0b004aeba2b16cf25a1/src/exchange/mixins/Hashing.sol#L19
    // Notice how we don't need any signature in the hashing function; you HAVE
    // to omit for consistency. Hashing functions are, pure, deterministic
    // functions with sensitive hearts, you have to care about your inputs!!!
    const { signature, ...orderWithoutSignature } = order;

    // To be fair, a lot of this is trial and error and reading the specs/source code of other projects
    // to figure the complex parts out. If you want to understand this, go step by step by reading the
    // ETH standards underpinning this and the source of the contract !
    return hashTypedData({
        // this should be changed if it's negrisk or normal market
        domain: getPolymarketEIP712Domain(false),
        types: {
            Order: POLYMARKET_ORDER_TYPED_DATA,
        },
        primaryType: "Order",
        message: orderWithoutSignature,
    });
};

export default computeOrderHash;
