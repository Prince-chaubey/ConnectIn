const { GoogleGenerativeAI } = require("@google/generative-ai");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the Cloudinary public_id from a full Cloudinary URL.
 * e.g. https://res.cloudinary.com/demo/raw/upload/v123/connectsphere_resumes/file.pdf
 *   → connectsphere_resumes/file.pdf
 */
const extractPublicId = (url) => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  return match ? match[1] : null;
};

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

  // Generate a signed Cloudinary URL valid for 5 minutes to bypass access restrictions
  const publicId = extractPublicId(resumeUrl);
  let fetchUrl = resumeUrl; // fallback

  if (publicId) {
    fetchUrl = cloudinary.url(publicId, {
      resource_type: "raw",
      type:          "upload",
      sign_url:      true,
      secure:        true,
      expires_at:    Math.floor(Date.now() / 1000) + 300, // 5 min
    });
  }

  const response = await fetch(fetchUrl);
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

