type OpenRouterEmbeddingResponse = {
  data?: Array<{ embedding?: number[] }>;
};

export const createEmbeddings = async (input: string[]) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is required to create embeddings");
  }

  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.OPENROUTER_SITE_URL ?? "http://localhost:5173",
      "X-Title": process.env.OPENROUTER_APP_NAME ?? "Lodgr",
    },
    body: JSON.stringify({
      model:
        process.env.OPENROUTER_EMBEDDING_MODEL ??
        "openai/text-embedding-3-small",
      input,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenRouter embedding request failed: ${body}`);
  }

  const data = (await response.json()) as OpenRouterEmbeddingResponse;
  const embeddings = data.data?.map((item) => item.embedding ?? []) ?? [];

  if (embeddings.length !== input.length || embeddings.some((item) => !item.length)) {
    throw new Error("OpenRouter returned incomplete embeddings");
  }

  return embeddings;
};
