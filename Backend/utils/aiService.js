const { GoogleGenAI } = require('@google/genai');

/**
 * Get a humanized weekly summary from daily input strings using Google GenAI.
 * Now also accepts emissions context (from TIM) via options.emissions.
 * @param {string[]} inputs
 * @param {Object} [options] - { periodStart, periodEnd, emissions? }
 * @returns {Promise<string>}
 */
exports.getSummary = async (inputs, options = {}) => {
  if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
    throw new Error('No inputs provided for summarization.');
  }

  const { periodStart, periodEnd, emissions } = options;

  let weekString = '';
  if (periodStart && periodEnd) {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    weekString = `Week: ${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
  } else {
    weekString = 'Week: [Fill in week range]';
  }

  // Build emissions context text
  let emissionsContextText = 'No quantified emissions data was provided for this period.';
  if (emissions) {
    const totalKg = Math.round((emissions.co2TotalGrams || 0) / 1000);
    const perPaxGrams = Math.round(emissions.co2GramsPerPax || 0);
    const modelVersion = emissions.timModelVersion || 'unknown';

    emissionsContextText =
      `Estimated emissions for this period are approximately ${totalKg} kg of CO₂ in total, ` +
      `with about ${perPaxGrams} grams of CO₂ per passenger. ` +
      `These values are based on Google Travel Impact Model version ${modelVersion}. ` +
      `You should describe emissions performance qualitatively (higher/lower, improving/worsening) ` +
      `without inventing any new numeric values.`;
  }

  // --- Plain-text, table, humanized prompt with emissions awareness ---
  const prompt = `
You are an expert business writer assisting a sustainability manager. Write a weekly activity report based on the provided daily notes and the emissions context.

IMPORTANT:
- Write in warm, professional, human language (not robotic).
- DO NOT use asterisks (*), bold (**), underscores (_), or any Markdown formatting.
- Use only plain text: headings in ALL CAPS, numbered or lettered lists (a), b), etc.) for items.
- For Stakeholder Engagements, always present as an ASCII table (columns separated by vertical bars |, with underlining), like the example below.
- Begin with a conversational paragraph summarizing the week's tone and main themes.
- Explicitly mention emissions performance using ONLY the emissions context provided below (do not invent new numbers).
- For sections with no data, write "None".

EMISSIONS CONTEXT FOR THIS WEEK:
${emissionsContextText}

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
    // Local/dev stub version, now also briefly mentions emissions if available
    const emissionsLine = emissions
      ? `Emissions for the week were approximately ${Math.round(
          (emissions.co2TotalGrams || 0) / 1000
        )} kg CO₂ in total.`
      : 'No emissions figures were available for this week.';

    return `
MANAGER SUSTAINABILITY AFRICA
WEEKLY ACTIVITY REPORT
${weekString}

This week, we focused on team collaboration and regional sustainability priorities. ${emissionsLine}

1. WEEKLY PRIORITIES:
a) ${inputs[0] || 'None'}
b) ${inputs[1] || 'None'}

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
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    if (response.text) {
      return response.text.trim();
    } else if (response.content) {
      return response.content.trim();
    } else {
      throw new Error('Google GenAI did not return a valid summary.');
    }
  } catch (error) {
    console.error(
      'Google GenAI summarization failed:',
      error?.response?.data || error.message
    );
    throw new Error('Failed to summarize inputs with Google GenAI.');
  }
};
