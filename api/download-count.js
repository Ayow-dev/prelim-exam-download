// Vercel serverless function (acts as our Express-style API).
// GET  -> returns the current download count
// POST -> increments the download count by 1 and returns the new value
import { MongoClient } from "mongodb";

let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  try {
    const client = await getClient();
    const db = client.db("examDownloads");
    const collection = db.collection("counter");

    if (req.method === "GET") {
      const doc = await collection.findOne({ _id: "downloadCount" });
      return res.status(200).json({ count: doc?.count ?? 0 });
    }

    if (req.method === "POST") {
      const result = await collection.findOneAndUpdate(
        { _id: "downloadCount" },
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: "after" }
      );
      const count = result?.value?.count ?? result?.count ?? 1;
      return res.status(200).json({ count });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
