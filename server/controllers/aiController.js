const { GoogleGenAI } = require("@google/genai");

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

const analyzeRfp = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide RFP or tender text for analysis.",
      });
    }

    if (
      !process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY === "your_gemini_api_key"
    ) {
      return res.status(503).json({
        success: false,
        message: "Gemini API key is not configured on the server.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are an expert government tender and RFP analyst.

Analyze the following tender/RFP text and return ONLY valid JSON.

Required JSON structure:

{
  "summary": "short summary",
  "keyRequirements": [],
  "requiredSkills": [],
  "experienceRequirements": [],
  "importantDeadlines": [],
  "suggestedWriterProfile": {
    "skills": [],
    "industries": [],
    "minimumExperience": 0
  },
  "riskFactors": [],
  "recommendations": []
}

Rules:
- Return ONLY valid JSON.
- Do not use markdown.
- Do not add explanations outside JSON.
- Keep arrays concise and useful.
- If information is not available, return an empty array or 0.
- Do not invent specific facts that are not present in the RFP.

Tender/RFP text:

${text}
`;

    let response = null;
    let lastError = null;

    for (const model of MODELS) {
      let modelSucceeded = false;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(
            `Trying Gemini model: ${model} | attempt ${attempt}/2`
          );

          response = await ai.models.generateContent({
            model,
            contents: prompt,
          });

          modelSucceeded = true;
          break;
        } catch (error) {
          lastError = error;

          const status =
            error?.status ||
            error?.error?.code ||
            error?.response?.status;

          console.error(
            `Gemini ${model} failed on attempt ${attempt}:`,
            error?.message || error
          );

          if (
            status !== 503 &&
            status !== 429 &&
            status !== 500
          ) {
            throw error;
          }

          if (attempt < 2) {
            await sleep(1500);
          }
        }
      }

      if (modelSucceeded && response) {
        console.log(`Gemini analysis succeeded using ${model}`);
        break;
      }

      console.log(
        `Switching from ${model} to the next available Gemini model...`
      );
    }

    if (!response) {
      console.error(
        "All Gemini models failed:",
        lastError?.message || lastError
      );

      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily unavailable. Please try again in a few moments.",
      });
    }

    let resultText = response.text || "";

    resultText = resultText
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    let analysis;

    try {
      analysis = JSON.parse(resultText);
    } catch (error) {
      console.error("Invalid Gemini JSON response:", resultText);

      return res.status(500).json({
        success: false,
        message:
          "AI returned an invalid analysis format. Please try again.",
      });
    }

    return res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("AI RFP analysis error:", error);

    const status =
      error?.status ||
      error?.error?.code ||
      error?.response?.status;

    if (status === 503 || status === 429) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily unavailable. Please try again in a few moments.",
      });
    }

    if (status === 404) {
      return res.status(500).json({
        success: false,
        message:
          "The configured Gemini model is unavailable. Please check the AI model configuration.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to analyze the RFP. Please try again.",
    });
  }
};

module.exports = {
  analyzeRfp,
};