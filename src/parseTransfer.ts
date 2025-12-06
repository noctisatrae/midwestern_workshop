import { decodeFunctionData, formatUnits, parseEventLogs } from "viem";
import { USDCE_ABI } from "../assets/polymarket/usdce";
import { getRpc } from "./lib/getRpc";

const INTERESTING_TRANSACTION =
    "0x2593bc78f4c9b357b01382f038a804f0646e6ff45ede009b99d012997299cd66";

const polygonRpc = getRpc();

const [tx, receipt] = await Promise.all([
    polygonRpc.getTransaction({
        hash: INTERESTING_TRANSACTION,
    }),
    polygonRpc.getTransactionReceipt({
        hash: INTERESTING_TRANSACTION,
    }),
]);

const { args: functionArgs } = decodeFunctionData({
    abi: USDCE_ABI,
    data: tx.input,
});

// Function: transfer(address recipient, uint256 amount)
console.debug({
    recipient: functionArgs[0],
    amount: formatUnits(functionArgs[1]! as bigint, 6),
});

const logs = parseEventLogs({
    abi: USDCE_ABI,
    logs: receipt.logs,
});

const transfer = logs.find((l) => l.eventName === "Transfer")?.args;
if (!transfer) throw new Error("Transfer event not found");
console.debug({
    ...transfer,
    // usdc is six decimals
    value: formatUnits(transfer.value, 6),
});
