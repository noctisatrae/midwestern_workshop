import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";

// A RPC is a "remote procedure call" which is a function call as an API
// We call the servers that help us interact with the blockchain (the EVM) "RPCs"
// because no one in this industry knows what they're doing ;)
export const getRpc = () => {
    const rpcUri = process.env.POLYGON_RPC;
    if (!rpcUri) throw new Error("POLYGON_RPC environment variable is not set");

    const client = createPublicClient({
        chain: polygon,
        transport: http(rpcUri),
    });

    return client;
};
