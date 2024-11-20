


// // Initialize the OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// // Function to fetch user-specific data (mocked for this example)

// // Function to generate personalized financial advice
// const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
//   console.log(totalBudget, totalIncome, totalSpend);
//   try {
//     const userPrompt = `
//       Based on the following financial data:
//       - Total Budget: ${totalBudget} USD 
//       - Expenses: ${totalSpend} USD 
//       - Incomes: ${totalIncome} USD
//       Provide detailed financial advice in 2 sentence to help the user manage their finances more effectively.
//     `;

//     // Send the prompt to the OpenAI API
//     const chatCompletion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [{ role: "user", content: userPrompt }],
//     });

//     // Process and return the response
//     const advice = chatCompletion.choices[0].message.content;

//     console.log(advice);
//     return advice;
//   } catch (error) {
//     console.error("Error fetching financial advice:", error);
//     return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
//   }
// };


// import { GoogleGenerativeAI } from "@google/generative-ai";

//   // Initialize the Google Generative AI client
//   const apiKey = process.env.GEMINI_API_KEY; // Replace with your actual API key
//   const genAI = new GoogleGenerativeAI(apiKey);
  
//   // Configure the generative model
//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash", // Use the correct model version
//   });
  
//   // Configuration for text generation
//   const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 40,
//     maxOutputTokens: 8192,
//     responseMimeType: "text/plain",
//   };
  
//   // Function to generate personalized financial advice
//   const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
//     try {
//       const userPrompt = 
//         "whats the weather like outside?";
  
//       // Start a chat session with the model
//       const chatSession = model.startChat({
//         generationConfig,
//         history: [], // Initialize chat history
//       });
  
//       // Send the user prompt
//       const result = await chatSession.sendMessage(userPrompt);
  
//       // Extract and return the advice from the response
//       const advice = result.response.text();
//       console.log(advice);
//       return advice;
//     } catch (error) {
//       console.error("Error fetching financial advice:", error);
//       return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
//     }
//   };

//   module.exports = getFinancialAdvice;

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
import { useState } from "react";
// Initialize the generative model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Ensure this is the correct model ID for your use case
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};


// Function to fetch personalized financial advice
const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log(totalBudget, totalIncome, totalSpend); // Log the inputs for debugging
  try {
    // Construct the prompt
    const userPrompt = `
      Based on the following financial data:
      - Total Budget: ${totalBudget} USD 
      - Expenses: ${totalSpend} USD 
      - Incomes: ${totalIncome} USD
      Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
    `;

    // Start chat session and send the message
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Generate the content using the provided prompt
    const result = await chatSession.sendMessage(userPrompt);

    // Extract and return the response
    if (advice) {
      setFinancialAdvice(advice); // Set advice if it's valid
    } else {
      console.error("No advice returned, invalid response.");
      setFinancialAdvice("No advice available at the moment.");
    }
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    if (error.response) {
      console.error("API Error Response:", error.response.status, error.response.data);
    }
  }
  
};

module.exports = getFinancialAdvice;
