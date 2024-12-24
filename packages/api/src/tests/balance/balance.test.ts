import { TatumSDK } from "@tatumio/tatum";
import express from "express";
import request from "supertest";
import middlewares from "../../middlewares.js";
import balanceRouter from "../../routes/balance/route.js";

// Mock the TatumSDK
jest.mock("@tatumio/tatum");

// Mock environment variables
jest.mock("../../envParsed.js", () => ({
  __esModule: true,
  default: () => ({
    API_KEY: "test-api-key",
  }),
}));

describe("Balance Router", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Add error handling middleware to the test app
    app.use("/balance", balanceRouter);
    app.use(middlewares.errorHandler);
  });

  describe("GET /balance", () => {
    it("should return balance for valid address", async () => {
      const mockBalance = {
        data: {
          balance: "100000000000000000",
          tokens: [],
        },
      };

      const mockTatum = {
        address: {
          getBalance: jest.fn().mockResolvedValue(mockBalance),
        },
      };

      (TatumSDK.init as jest.Mock).mockResolvedValue(mockTatum);

      const validAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      const response = await request(app)
        .get(`/balance?address=${validAddress}`)
        .expect(200);

      expect(response.body).toEqual(mockBalance.data);
      expect(mockTatum.address.getBalance).toHaveBeenCalledWith({
        addresses: [validAddress],
      });
    });

    it("should return error for invalid address format", async () => {
      const invalidAddress = "invalid-address";
      const response = await request(app)
        .get(`/balance?address=${invalidAddress}`)
        .expect(400);

      expect(response.body).toEqual({
        message: "Missing or invalid address",
        status: 400,
      });
    });

    it("should return error when address is missing", async () => {
      const response = await request(app).get("/balance").expect(400);

      expect(response.body).toEqual({
        message: "Missing or invalid address",
        status: 400,
      });
    });

    it("should handle Tatum API errors", async () => {
      const mockError = new Error("API Error");
      const mockTatum = {
        address: {
          getBalance: jest.fn().mockRejectedValue(mockError),
        },
      };

      (TatumSDK.init as jest.Mock).mockResolvedValue(mockTatum);

      const validAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      const response = await request(app)
        .get(`/balance?address=${validAddress}`)
        .expect(500);

      expect(response.body).toEqual({
        message: "API Error",
        status: 500,
      });
    });
  });
});
