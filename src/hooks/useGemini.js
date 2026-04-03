const FOCUS_MAP = {
  full: 'bugs, code quality, performance, security, and suggestions',
  bugs: 'only bugs, logic errors, and runtime failures',
  security: 'only security vulnerabilities and risky patterns',
  performance: 'only performance bottlenecks and optimization opportunities',
  style: 'only code style, readability, naming conventions, and structure',
};

import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `VITE_GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function main(code, language, focus) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert ${language} engineer and code reviewer.
              Review the following ${language} code. Focus on: ${FOCUS_MAP[focus]}.
              Use clear markdown headings (## Section) for each area you cover.
              Be concise, specific, and actionable.

            \`\`\`${language}
            ${code}
            \`\`\``
  });

  // console.log(response.text);
  return response.text;
}

/*
Solutions
Because this is a temporary issue, here's how to handle it in a project:
🔶  Retry After a Delay: Implement retries with exponential backoff. Wait a few seconds, and try again. If it fails again, increase the wait time before retrying.
🔶  Use a Stable Model: Use a stable, non-preview version, such as gemini-1.5-flash or gemini-2.0-flash.
🔶  Implement a Fallback: Write code to try gemini-3-flash-preview first. If a 503 error occurs, automatically switch to gemini-1.5-flash.
*/