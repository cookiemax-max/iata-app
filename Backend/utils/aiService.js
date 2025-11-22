const { GoogleGenAI } = require('@google/genai');

/**
 * Get a humanized weekly summary from daily input strings using Google GenAI.
 * Returns a plain-text, natural-sounding report with Stakeholder Engagements as an ASCII table.
 * @param {string[]} inputs - Daily input strings
 * @param {Object} [options] - Optionally pass { periodStart, periodEnd }
 * @returns {Promise<string>} - Humanized summary report as plain text
 */
exports.getSummary = async (inputs, options = {}) => {
  if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
    throw new Error('No inputs provided for summarization.');
  }

  let weekString = '';
  if (options.periodStart && options.periodEnd) {
    const start = new Date(options.periodStart);
    const end = new Date(options.periodEnd);
    weekString = `Week: ${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
  } else {
    weekString = 'Week: [Fill in week range]';
  }

  // --- Strong plain-text, table, humanized prompt ---
  const prompt = `
You are an expert business writer assisting a sustainability manager. Write a weekly activity report based on the provided daily notes.

IMPORTANT: 
- Write in warm, professional, human language (not robotic).
- DO NOT use asterisks (*), bold (**), underscores (_), or any Markdown formatting.
- Use only plain text: headings in ALL CAPS, numbered or lettered lists (a), b), etc.) for items.
- For Stakeholder Engagements, always present as an ASCII table (columns separated by vertical bars |, with underlining), like the example below.
- Begin with a conversational paragraph summarizing the week's tone and main themes.
- For sections with no data, write "None".

EXAMPLE FORMAT:

MANAGER SUSTAINABILITY AFRICA
WEEKLY ACTIVITY REPORT
${weekString}

[Intro paragraph]

1. WEEKLY PRIORITIES:
a)
b)

2. KEY DELIVERABLES:
a)
b)

3. STAKEHOLDER ENGAGEMENTS:
Date      | Stakeholder / Team     | Purpose / Outcome
----------|------------------------|-------------------------
06/03     | Example Corp           | Discussed sustainability goals
06/04     | Team B                 | Provided training updates

4. CHALLENGES & NOTES:
a)
b)

5. UPCOMING FOCUS:
a)
b)

Below are the daily entries:
${inputs.map((val, i) => `Day ${i + 1}: ${val}`).join('\n')}

Your task: Write only the finished report above. Do not use any Markdown symbols or formatting, do not reference these instructions, and do not disclose your AI status.
`;

  const GOOGLE_GENAI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;

  if (!GOOGLE_GENAI_API_KEY) {
    // Local/dev stub version
    return `
MANAGER SUSTAINABILITY AFRICA
WEEKLY ACTIVITY REPORT
${weekString}

This week, we focused on team collaboration and regional sustainability priorities.

1. WEEKLY PRIORITIES:
a) ${inputs[0] || "None"}
b) ${inputs[1] || "None"}

2. KEY DELIVERABLES:
a) [Stub: Key deliverable]

3. STAKEHOLDER ENGAGEMENTS:
Date      | Stakeholder / Team     | Purpose / Outcome
----------|------------------------|-------------------------
[Stub data]

4. CHALLENGES & NOTES:
a) None

5. UPCOMING FOCUS:
a) None
    `.trim();
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GOOGLE_GENAI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });

    if (response.text) {
      return response.text.trim();
    } else if (response.content) {
      return response.content.trim();
    } else {
      throw new Error("Google GenAI did not return a valid summary.");
    }
  } catch (error) {
    console.error("Google GenAI summarization failed:", error?.response?.data || error.message);
    throw new Error("Failed to summarize inputs with Google GenAI.");
  }
};
