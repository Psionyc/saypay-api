import Elysia from "elysia";
import { SuccessResponse, ErrorResponse } from "../shcemas/_helpers";
import { fetchBinancePrice } from "../utils/fetchBinancePrice";

export const DataRoutes = new Elysia({
	name: "DataRoutes",
	prefix: "/data",
}).get("/price/:tokenId", async ({ params: { tokenId }, set }) => {
	try {
		const priceData = await fetchBinancePrice(tokenId);
		return SuccessResponse(priceData, {
			message: `Price for ${priceData.symbol}`,
		});
	} catch (error: any) {
		set.status = 500;
		return ErrorResponse({
			message: `Failed to fetch price for ${tokenId}: ${error.message}`,
		});
	}
});
