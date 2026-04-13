const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Analyzes a resume PDF using Gemini AI and scores it against a role.
 */
const analyzeResume = async ({
  resumeUrl,
  roleName,
  roleDescription,
  skillsRequired,
  applicantSkills,
}) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Cloudinary raw uploads are publicly accessible — fetch directly from the stored URL
  const response = await fetch(resumeUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch resume: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  const prompt = `You are an expert technical recruiter performing CV shortlisting.

ROLE DETAILS:
- Role Name: ${roleName}
- Role Description: ${roleDescription || "Not specified"}
- Required Skills: ${skillsRequired?.length ? skillsRequired.join(", ") : "Not specified"}
- Applicant's Profile Skills: ${applicantSkills?.length ? applicantSkills.join(", ") : "Not specified"}

TASK:
Carefully read the attached resume PDF and evaluate how well this candidate fits the role above.

Respond with ONLY a valid JSON object — no markdown, no code block, no explanation — in this exact format:
{
  "score": <integer 0-100>,
  "summary": "<2-3 sentence overall assessment of the candidate's fit>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"]
}

Score guide: 0-40 = Poor fit, 41-60 = Average, 61-80 = Good fit, 81-100 = Excellent fit`;

  const result = await model.generateContent([
    { inlineData: { mimeType: "application/pdf", data: base64 } },
    prompt,
  ]);

  const text = result.response.text().trim();
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned);
};

module.exports = analyzeResume;

