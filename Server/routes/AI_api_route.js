
import express from 'express';
const Api_Route = express.Router();

Api_Route.post('/chat', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.open_router_api}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openrouter/auto", // Or your preferred free model
                "messages": [{ "role": "user", "content": prompt }]
            })
        });

        const data = await response.json();
        if (data.error) {
            return res.status(500).json({ message: "AI Error: " + data.error.message });
        }

        if (!data.choices || data.choices.length === 0) {
            return res.status(500).json({ message: "AI returned no choices." });
        }
        
        res.json({ message: data.choices[0].message.content });
        
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to connect to AI" });
    }
});

export default Api_Route;