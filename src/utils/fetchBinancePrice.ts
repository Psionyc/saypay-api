import { priceCache } from "../providers/cache.provider";

// Function to fetch price from Binance API
export async function fetchBinancePrice(tokenId: string) {
	try {
		// Normalize the token ID to uppercase
		const symbol = tokenId.toUpperCase();

		// Check if we have a cached value
		const cachedPrice = priceCache.get(symbol);
		if (cachedPrice !== undefined) {
			return {
				symbol: symbol,
				price: cachedPrice,
			};
		}

		// Handle special case for USDT (USDT/USDT doesn't make sense)
		if (symbol === "USDT") {
			const price = 1.0;
			priceCache.set(symbol, price);
			return {
				symbol: "USDT",
				price,
			};
		}

		// For common pairs, we might need to append USDT
		const tradingPair = symbol.endsWith("USDT") ? symbol : `${symbol}USDT`;

		const response = await fetch(
			`https://api.binance.com/api/v3/ticker/price?symbol=${tradingPair}`,
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		const price = parseFloat(data.price);

		// Cache the price
		priceCache.set(symbol, price);

		return {
			symbol: data.symbol,
			price,
		};
	} catch (error) {
		console.error("Error fetching price from Binance:", error);
		throw error;
	}
}
