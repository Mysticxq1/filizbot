import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Sen Türkçe konuşan, etkileyici emlak ilanları yazan profesyonel bir yardımcı botsun." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85,
      max_tokens: 900,
    });
    const result = completion.data.choices[0].message?.content || "";
    res.status(200).json({ result });
  } catch (err: any) {
    console.error("OpenAI API error:", err.response?.data || err.message);
    res.status(500).json({ error: "OpenAI API error" });
  }
}
