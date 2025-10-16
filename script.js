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
      // TODO: Replace the URL below with your actual API endpoint
      const response = await fetch('https://api.example.com/translation-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ source, translation })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // Format the API response for display
      let output = '';
      if (data.issues && Array.isArray(data.issues) && data.issues.length > 0) {
        data.issues.forEach((issue) => {
          const type = issue.type || 'Issue';
          const message = issue.message || JSON.stringify(issue);
          output += `• ${type}: ${message}\n`;
        });
      } else if (typeof data === 'string') {
        output = data;
      } else {
        output = JSON.stringify(data, null, 2);
      }
      resultsContent.textContent = output;
    } catch (error) {
      resultsContent.textContent = `Error: ${error.message}`;
    }
  });
});