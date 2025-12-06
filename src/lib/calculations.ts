import { formatUnits } from "viem";
import { OrderSide, type FilledOrder } from "../types/polymarket";

export const determineRelevantAssetAndAmount = (
    side: OrderSide,
    order: FilledOrder,
) => {
    if (side === OrderSide.BUY) {
        return { assetId: order.takerAssetId, amount: order.takerAmountFilled };
    } else {
        return { assetId: order.makerAssetId, amount: order.makerAmountFilled };
    }
};

const convertLossy = (value: bigint) => Number(formatUnits(value, 6));

export const determineSharePrice = (side: OrderSide, order: FilledOrder) => {
    if (side === OrderSide.SELL) {
        return (
            convertLossy(order.takerAmountFilled) /
            convertLossy(order.makerAmountFilled)
        );
    } else {
        return (
            convertLossy(order.makerAmountFilled) /
            convertLossy(order.takerAmountFilled)
        );
    }
};
