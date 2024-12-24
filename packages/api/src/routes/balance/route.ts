import { Ethereum, Network, TatumSDK } from "@tatumio/tatum";
import { Request, Response, Router } from "express";
import envParsed from "../../envParsed.js";
import middlewares from "../../middlewares.js"; // Import the rate limiter

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

const router = Router();

router.get(
  "/",
  middlewares.rateLimiter(),
  middlewares.errorCatchMiddleware(async (req: Request, res: Response) => {
    const address = req.query.address as string;

    if (!address || !ADDRESS_REGEX.test(address)) {
      res.status(400);
      throw new Error("Missing or invalid address");
    }

    const tatum = await TatumSDK.init<Ethereum>({
      network: Network.ETHEREUM,
      apiKey: { v4: envParsed().API_KEY },
      verbose: true,
    });

    const balance = await tatum.address.getBalance({
      addresses: [address],
    });

    res.json(balance.data);
  })
);

export default router;
