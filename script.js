// script.js
// This file handles the front‑end logic for submitting the translation check form
// and displaying the results returned from the API. It uses the Fetch API to
// send a POST request containing the original Chinese text and its English
// translation, then renders the issues or messages provided by the API.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('check-form');
  const resultsDiv = document.getElementById('results');
  const resultsContent = document.getElementById('results-content');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const source = document.getElementById('source-text').value.trim();
    const translation = document.getElementById('translation-text').value.trim();

    if (!source || !translation) {
      alert('Please enter both the original Chinese text and the English translation.');
      return;
    }

    // Show a simple loading indicator
    resultsDiv.classList.remove('hidden');
    resultsContent.textContent = 'Checking translation...';

    try {
      /*
       * Use the LinkAPI (https://hk.linkapi.ai/v1) as a drop‑in replacement for
       * the OpenAI Chat Completions API. This endpoint is OpenAI compatible,
       * which means we can send the same JSON payload used to query
       * gpt‑3.5‑turbo. The API key provided by the user is passed as a
       * Bearer token in the Authorization header. If you plan to make this
       * project public, consider moving the key into an environment variable
       * and creating a small proxy/serverless function to keep the secret
       * private.
       */
      const apiKey = 'sk-Aexs6XDMzlTSlPg1wLnEqynAr9zz4QN4wLRuDfUitTwidj4Q';
      const apiUrl = 'https://hk.linkapi.ai/v1/chat/completions';
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional translation checker. For each request you will compare the provided original Chinese text with its English translation. Identify any grammar mistakes, mistranslations, logical inconsistencies, or punctuation errors in the English translation. Also provide suggestions to make the translation more natural and idiomatic. Return your findings as a human‑readable report.'
          },
          {
            role: 'user',
            content: `原文：${source}\n译文：${translation}`
          }
        ],
        temperature: 0.0
      };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      /*
       * The response from an OpenAI compatible API will contain an array
       * called `choices`. Each choice has a `message` with a `content`
       * property that holds the assistant’s reply. We simply display
       * that content to the user. If you need more structured output,
       * adjust the system prompt above accordingly and parse the JSON here.
       */
      const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      resultsContent.textContent = content || 'No analysis returned.';
    } catch (error) {
      resultsContent.textContent = `Error: ${error.message}`;
    }
  });
});