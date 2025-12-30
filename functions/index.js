const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const Anthropic = require("@anthropic-ai/sdk");

// Set global options
setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_KEY,
});

exports.recompileEntry = onCall(async (request) => {
  try {
    const { entryContent, entryId } = request.data;

    // Call Claude API for summary and questions
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are analyzing a mental health journal entry. The user has ADHD-inattentive type, high IQ with executive dysfunction, trauma response creating paralysis, and is in financial crisis while trying to learn TikTok shop business.

ENTRY:
${entryContent}

TASKS:
1. Write a 2-3 sentence summary extracting key themes, events, and emotional states.
2. Generate 2-4 clarifying questions to help build a chronological timeline. Focus on:
   - Unclear time references ("yesterday", "that thing in 2019")
   - Vague pronouns or references
   - Conflicting information
   - Events mentioned without context

Respond ONLY with valid JSON in this exact format:
{
  "summary": "your 2-3 sentence summary here",
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}`,
        },
      ],
    });

    const responseText = message.content[0].text;
    const parsed = JSON.parse(responseText);

    // Format questions for Firestore
    const clarifications = parsed.questions.map((q, idx) => ({
      id: idx + 1,
      question: q,
      answered: false,
      answer: null,
    }));

    // Update entry in Firestore
    await admin.firestore().collection("entries").doc(entryId).update({
      summarized: true,
      summary: parsed.summary,
      clarifications: clarifications,
    });

    return {
      success: true,
      summary: parsed.summary,
      clarifications: clarifications,
    };
  } catch (error) {
    console.error("Recompilation error:", error);
    throw new HttpsError(
      "internal",
      "Failed to recompile entry",
      error.message
    );
  }
});