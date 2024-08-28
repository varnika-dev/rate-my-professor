// pages/api/query.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Ensure that the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST method.' });
  }

  // Retrieve the API key from environment variables
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('API key is missing');
    return res.status(500).json({ error: 'API key is missing' });
  }

  try {
    // Extract userQuery and professorLink from request body
    const { userQuery, professorLink } = req.body;

    // Check if userQuery is present for AI processing
    if (userQuery) {
      // Construct the payload for the AI request
      const payload = {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          // Request detailed information including ratings
          { role: 'user', content: `Provide detailed information about professors, including ratings, based on the query: ${userQuery}` }
        ]
      };

      // Define headers for the AI request
      const aiHeaders = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      };

      // Make the API request to OpenRouter
      const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: aiHeaders,
        body: JSON.stringify(payload)
      });

      // Check if the response from the AI API is OK
      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI API request failed:', {
          status: aiResponse.status,
          statusText: aiResponse.statusText,
          responseBody: errorText
        });
        return res.status(aiResponse.status).json({ error: errorText || 'Failed to fetch completion' });
      }

      // Extract and log the AI response body
      const aiResponseBody = await aiResponse.json();
      console.log('AI API response body:', aiResponseBody);

      // Extract the assistant's message content
      const assistantMessage = aiResponseBody.choices[0]?.message?.content || 'No message content available';

      // Format the response to clean up the message content and ensure spacing
      const formattedResponse = assistantMessage
        .replace(/\*/g, '') // Remove * characters
        .split('\n')        // Split by new lines
        .map(line => line.trim()) // Trim whitespace from each line
        .filter(line => line.length > 0) // Remove empty lines
        .join('\n\n');      // Add spacing between lines

      return res.status(200).json({ aiReply: formattedResponse });
    }

    // Handle professorLink submission
    if (professorLink) {
      // TODO: Add logic to process professorLink, possibly including interactions with Pinecone

      // Placeholder response indicating successful processing
      return res.status(200).json({ message: 'Professor data processed successfully.' });
    }

    // Return error if neither userQuery nor professorLink is provided
    return res.status(400).json({ error: 'Missing userQuery or professorLink in request body' });
  } catch (error) {
    console.error('Error processing request:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
