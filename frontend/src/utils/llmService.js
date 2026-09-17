// llmService.js - Mock service for LLM and RAG interactions

/**
 * Simulates a delay for typing effects or network requests
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mocks an LLM stream response
 * @param {string} prompt User's question
 * @param {Function} onChunk Callback for each chunk of text
 * @param {Function} onComplete Callback when stream finishes
 */
export const mockLLMStream = async (prompt, context, onChunk, onComplete) => {
  let responseText = "";
  
  if (prompt.toLowerCase().includes("blood pressure")) {
    responseText = "Based on the report, the patient's blood pressure is 120/80 mmHg, which is considered normal. However, please consult a physician for a comprehensive medical opinion.";
  } else if (prompt.toLowerCase().includes("cholesterol")) {
    responseText = "The report indicates that the total cholesterol level is 185 mg/dL. This is within the normal reference range (< 200 mg/dL). HDL is 55 mg/dL and LDL is 110 mg/dL.";
  } else {
    responseText = "I've analyzed the document. " + 
      "The provided medical report shows several biomarkers. " + 
      "Could you please specify which exact test result you are inquiring about? For example, you can ask about 'blood pressure', 'cholesterol', or 'glucose levels'.";
  }

  // Simulate streaming
  const words = responseText.split(" ");
  for (let i = 0; i < words.length; i++) {
    await delay(50 + Math.random() * 50); // random delay between 50-100ms
    onChunk(words[i] + (i === words.length - 1 ? "" : " "));
  }
  
  if (onComplete) onComplete();
};

/**
 * Mocks RAG retrieval. Returns relevant text snippets from the document.
 */
export const mockRetrieveContext = async (prompt, documentData) => {
  await delay(500); // simulate network request for embedding search

  if (prompt.toLowerCase().includes("blood pressure")) {
    return [
      { id: 1, text: "Vitals: BP 120/80 mmHg, HR 72 bpm, Temp 98.6 F.", confidence: 0.95 },
      { id: 2, text: "Patient denies any history of hypertension.", confidence: 0.82 }
    ];
  }
  
  if (prompt.toLowerCase().includes("cholesterol")) {
    return [
      { id: 3, text: "Lipid Panel: Total Cholesterol 185 mg/dL.", confidence: 0.98 },
      { id: 4, text: "HDL 55 mg/dL, LDL 110 mg/dL, Triglycerides 100 mg/dL.", confidence: 0.94 }
    ];
  }

  // Generic fallback
  return [
    { id: 5, text: "Comprehensive Metabolic Panel (CMP) results are attached below.", confidence: 0.65 },
    { id: 6, text: "Patient presents for an annual wellness exam.", confidence: 0.55 }
  ];
};
