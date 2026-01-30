
import { GoogleGenAI } from "@google/genai";
import { Player, Position } from "../types";

// NOTE: In a production app, the key should be in a .env file.
// We assume process.env.API_KEY is available and valid as per guidelines.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTransferAdvice = async (
  currentTeam: Player[], 
  bankBalance: number,
  freeTransfers: number
): Promise<string> => {
  const systemInstruction = `
    You are an expert Fantasy Premier League assistant for the Ethiopian market.
    Analyze the provided team and budget. Suggest 1-2 transfers to improve the team.
    Consider player form, fixture difficulty, and price.
    Keep the response short, concise, and motivating.
    Use emoji related to football and Ethiopia.
    Format the response in Markdown.
  `;

  const teamSummary = currentTeam.map(p => `${p.name} (${p.team} - ${p.position}) Form: ${p.form}, Price: ${p.price}m`).join('\n');
  
  const prompt = `
    My current team:
    ${teamSummary}
    
    Bank Balance: ${bankBalance}m
    Free Transfers: ${freeTransfers}
    
    Who should I buy and who should I sell for the upcoming Gameweek?
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for speed
      }
    });

    return response.text || "Could not generate advice at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am having trouble analyzing your team right now. Please try again later.";
  }
};

export const generatePlayerInsight = async (player: Player): Promise<string> => {
  const systemInstruction = `
    You are an expert FPL scout. Provide a very brief (2-3 sentences) "Why Pick Me?" summary for the given player.
    Focus on their form, stats (goals/assists/cleansheets), and potential.
    Use bold text for key stats.
    Keep it exciting and persuasive.
  `;

  const prompt = `
    Player: ${player.name} (${player.team} - ${player.position})
    Price: ${player.price}m
    Form: ${player.form}
    Total Points: ${player.total_points}
    Goals: ${player.goals_scored}
    Assists: ${player.assists}
    Clean Sheets: ${player.clean_sheets}
    ICT Index: ${player.stats_ict}
    
    Why should I have this player in my Fantasy Premier League team?
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "No scout report available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Scout report unavailable.";
  }
};
