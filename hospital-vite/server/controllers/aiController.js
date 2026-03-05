const Groq = require("groq-sdk");

const systemPrompt = `You are a helpful hospital assistant AI. Your role is to:
1. Listen to patients describe their symptoms
2. Ask clarifying questions to better understand their condition
3. Suggest which medical department or specialist they should visit
4. Provide basic first-aid tips if needed
5. Always remind users that you are an AI and they should consult a real doctor

Available departments: General Medicine, Cardiology, Orthopedics, Neurology, Pediatrics, Gynecology, Dermatology, ENT, Ophthalmology, Psychiatry

Be empathetic, concise, and always recommend professional medical consultation.
NEVER diagnose diseases. Only suggest departments to visit.`;

const symptomChecker = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "GROQ_API_KEY is missing in .env file" });
    }
    const { symptoms, conversationHistory = [] } = req.body;
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
      { role: "user", content: symptoms },
    ];

    const response = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    res.json({
      reply,
      updatedHistory: [
        ...conversationHistory,
        { role: "user", content: symptoms },
        { role: "assistant", content: reply },
      ],
    });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ message: "AI error: " + err.message });
  }
};

module.exports = { symptomChecker };
