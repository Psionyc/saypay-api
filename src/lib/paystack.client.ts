import createClient from "openapi-fetch";
import type { paths } from "./paystack";

export const paystackClient = createClient<paths>({
    baseUrl: "https://api.paystack.co",
    headers: {
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    }
})
