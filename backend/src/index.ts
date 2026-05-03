import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhookHandler } from "./webhooks/clerk";
import { getEnv } from "./lib/env";

const env = getEnv();
const app = express();

const rawJson = express.raw({ type: 'application/json', limit: '1mb' });

// it is important to use the rawJson middleware before the clerkMiddleware for the webhook route, otherwise the clerkMiddleware will consume the request body and the clerkWebhookHandler will not be able to verify the webhook signature

app.post('/webhooks/clerk', rawJson, (req, res)=>{
    void clerkWebhookHandler(req, res);
})

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.listen(env.PORT, () => console.log(`listening on port ${env.PORT}`));
