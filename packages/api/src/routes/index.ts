import { Router } from "express";

import balanceRoute from "./balance/route.js";

const router = Router();

router.use("/balance", balanceRoute);

export default router;
