interface Market {
    question: string;
    clobTokenIds: string;
    outcomes: string;
}

export const fetchMarkets = async (clobTokenId: bigint) => {
    const res = await fetch(
        `https://gamma-api.polymarket.com/markets?clob_token_ids=${String(clobTokenId)}`,
    );
    // unsafe too !!
    const data = (await res.json()) as Market[];
    const market = data.find((m) =>
        m.clobTokenIds.includes(String(clobTokenId)),
    );

    if (!market)
        throw new Error(`Market not found for clobTokenId ${clobTokenId}`);

    const clobTokenIds: string[] = JSON.parse(market.clobTokenIds);
    const outcomes: string[] = JSON.parse(market.outcomes);

    const outcomeMap = new Map(
        clobTokenIds.map((tokenId, idx) => [tokenId, outcomes[idx]]),
    );

    return {
        ...market,
        outcomes: outcomeMap,
    };
};
