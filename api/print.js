import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { urls } = req.body;
        await redis.lpush("queue", JSON.stringify(urls));
        res.json({ ok: true });
    } else if (req.method === "GET") {
        const timeoutMs = 30000;
        const pollInterval = 500;
        const start = Date.now();

        async function getFirstInQueue() {
            const jsonStr = await redis.lpop("queue");
            if (!jsonStr) return [];
            return JSON.parse(jsonStr);
        }

        let urls = await getFirstInQueue();

        while (urls.length === 0 && Date.now() - start < timeoutMs) {
            await sleep(pollInterval);
            urls = await getFirstInQueue();
        }

        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.json({ urls });
    } else {
        res.status(405).end("Method not allowed");
    }
}

