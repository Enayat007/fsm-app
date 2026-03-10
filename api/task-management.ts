const KV_KEY = process.env.TASKS_DATA_KEY || "fsm:task-management";

type AnyRecord = Record<string, unknown>;

function hasKvConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvCommand(command: string[]) {
  const url = process.env.KV_REST_API_URL!;
  const token = process.env.KV_REST_API_TOKEN!;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!response.ok) {
    throw new Error(`KV command failed with status ${response.status}`);
  }
  return response.json() as Promise<{ result: unknown }>;
}

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!hasKvConfig()) {
    res.status(503).json({ error: "Shared storage is not configured. Add KV_REST_API_URL and KV_REST_API_TOKEN." });
    return;
  }

  if (req.method === "GET") {
    try {
      const kv = await kvCommand(["GET", KV_KEY]);
      if (!kv.result || typeof kv.result !== "string") {
        res.status(200).json(null);
        return;
      }
      const parsed = JSON.parse(kv.result) as AnyRecord;
      res.status(200).json(parsed);
    } catch {
      res.status(500).json({ error: "Failed to load shared task data." });
    }
    return;
  }

  if (req.method === "PUT") {
    try {
      const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as AnyRecord;
      if (!body || typeof body !== "object" || !("implTasks" in body) || !("weeklyTasks" in body)) {
        res.status(400).json({ error: "Invalid payload." });
        return;
      }
      await kvCommand(["SET", KV_KEY, JSON.stringify(body)]);
      res.status(200).json({ ok: true });
    } catch {
      res.status(500).json({ error: "Failed to save shared task data." });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed." });
}
