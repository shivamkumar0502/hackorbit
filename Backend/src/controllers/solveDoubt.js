// const { GoogleGenAI } = require("@google/genai");

// const solveDoubt = async (req, res) => {
//   try {
//     const {
//       messages,
//       title,
//       description,
//       testCases,
//       startCode,
//       userCode,
//       action
//     } = req.body;

//     if (!messages || messages.length === 0) {
//       return res.status(400).json({
//         message: "Messages required"
//       });
//     }

//     const ai = new GoogleGenAI({
//       apiKey: process.env.GEMINI_KEY
//     });

//     const conversation = messages
//       .map((msg) => `${msg.role}: ${msg.content}`)
//       .join("\n");

//     const finalPrompt = `
// You are an expert DSA tutor helping solve ONE coding problem.

// =====================
// PROBLEM
// =====================
// Title: ${title}

// Description:
// ${description}

// Examples:
// ${JSON.stringify(testCases, null, 2)}

// Starter Code:
// ${JSON.stringify(startCode, null, 2)}

// User Code:
// ${userCode || "User has not written code yet"}

// =====================
// USER ACTION
// =====================
// ${action}

// =====================
// INSTRUCTIONS
// =====================

// If action = hint
// → Give small hints step-by-step.
// → Do NOT reveal full solution.

// If action = solution
// → Explain optimal approach.
// → Provide clean code.
// → Explain complexity.

// If action = debug
// → Analyze user code.
// → Find bug.
// → Fix code with explanation.

// If action = optimize
// → Suggest improvements.

// If action = edgecases
// → Provide important edge cases.

// Only discuss THIS problem.

// =====================
// CHAT HISTORY
// =====================
// ${conversation}

// Now respond as a helpful DSA tutor.
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: finalPrompt
//     });

//     res.status(200).json({
//       message: response.text
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "AI service error"
//     });
//   }
// };

// module.exports = solveDoubt;


const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
  try {

    const {
      messages,
      title,
      description,
      testCases,
      startCode,
      userCode,
      action
    } = req.body;


    // ===============================
    // Validate Request
    // ===============================

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        message: "Messages are required"
      });
    }


    // ===============================
    // Initialize Gemini
    // ===============================

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY
    });


    // ===============================
    // Convert Chat History
    // ===============================

    const conversation = messages
      .map((msg) => {
        const text = msg.parts && msg.parts.length > 0 ? msg.parts[0].text : "";
        return `${msg.role.toUpperCase()}: ${text}`;
      })
      .join("\n");


    // ===============================
    // Build Prompt
    // ===============================

    const finalPrompt = `
You are an expert Data Structures and Algorithms (DSA) tutor helping a user solve a coding problem.

Your responses must be focused ONLY on the current problem.

==============================
CURRENT PROBLEM
==============================

Title:
${title || "Unknown"}

Description:
${description || "No description provided"}

Examples:
${JSON.stringify(testCases || [], null, 2)}

Starter Code:
${JSON.stringify(startCode || {}, null, 2)}

User Code:
${userCode || "User has not written any code yet."}


==============================
USER REQUEST TYPE
==============================

${action || "chat"}


==============================
YOUR CAPABILITIES
==============================

1. Hint Provider
- Give small step-by-step hints
- Do NOT reveal full solution immediately

2. Solution Guide
- Explain the optimal algorithm
- Provide clean readable code
- Explain time complexity
- Explain space complexity

3. Code Debugger
- Analyze user's code
- Detect logical bugs
- Fix the code
- Explain what was wrong

4. Optimization Expert
- Suggest faster or cleaner approaches

5. Edge Case Finder
- Suggest tricky edge cases


==============================
RULES
==============================

You must ONLY talk about THIS problem.

If user asks unrelated things like web development, databases, or other topics, respond:

"I can only help with the current coding problem."


==============================
CHAT HISTORY
==============================

${conversation}


==============================
FINAL TASK
==============================

Analyze the conversation and respond as a helpful DSA tutor.

Provide clear explanations and helpful guidance.
`;


    // ===============================
    // Call Gemini API
    // ===============================

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt
    });


    // ===============================
    // Extract Text Safely
    // ===============================

    let aiText = "";

    if (
      response &&
      response.candidates &&
      response.candidates.length > 0 &&
      response.candidates[0].content &&
      response.candidates[0].content.parts &&
      response.candidates[0].content.parts.length > 0
    ) {
      aiText = response.candidates[0].content.parts[0].text;
    } else {
      aiText = "AI could not generate a response.";
    }


    // ===============================
    // Send Response
    // ===============================

    return res.status(200).json({
      message: aiText
    });


  } catch (error) {

    console.error("Gemini Error:", error);

    return res.status(500).json({
      message: "AI service error",
      error: error.message
    });

  }
};

module.exports = solveDoubt;