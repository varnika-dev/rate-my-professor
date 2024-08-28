import { PineconeClient } from '@pinecone-database/pinecone-client';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Pinecone client
const client = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT // specify your Pinecone environment if required
});

const index = client.Index(process.env.PINECONE_INDEX_NAME);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { professorLink, aiResponse } = req.body;

      if (professorLink) {
        // Extract data from the professor link
        const professorData = await extractDataFromLink(professorLink);

        // Convert extracted data to vector format
        const vectorValues = generateVectorFromData(professorData);

        const records = [
          {
            id: generateUniqueId(), // Implement this function based on your ID generation strategy
            namespace: 'Default', // Default namespace or customize as needed
            values: vectorValues,
            metadata: professorData // Include metadata if needed
          },
        ];

        // Upsert vectors into Pinecone index
        const response = await index.upsert({
          vectors: records,
          namespace: 'Default', // Customize namespace as needed
        });

        return res.status(200).json(response);
      }

      if (aiResponse) {
        // Process AI response as before
        const vectorValues = generateVectorFromResponse(aiResponse);

        const records = [
          {
            id: generateUniqueId(), // Implement this function based on your ID generation strategy
            namespace: 'Default', // Default namespace or customize as needed
            values: vectorValues,
            metadata: { aiResponse } // Include metadata if needed
          },
        ];

        // Upsert vectors into Pinecone index
        const response = await index.upsert({
          vectors: records,
          namespace: 'Default', // Customize namespace as needed
        });

        return res.status(200).json(response);
      }

      return res.status(400).json({ error: 'Missing professorLink or aiResponse in request body' });
    } catch (error) {
      console.error('Error extracting professor info:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function extractDataFromLink(professorLink) {
  // Implement the actual logic to extract data from the professor link
  // For demonstration purposes, let's assume it returns an object with details
  return {
    name: 'John Doe',
    rating: 4.5,
    department: 'Computer Science'
  };
}

function generateVectorFromData(professorData) {
  // Implement your logic to convert extracted professor data to vector values
  // This is a placeholder; use an appropriate method to generate a vector
  return [0.5, 0.2, -0.3]; // Example vector
}

function generateVectorFromResponse(aiResponse) {
  // Implement your logic to convert AI response to vector values
  // This is a placeholder; use appropriate method to generate a vector
  return [0.5, 0.2, -0.3]; // Example vector
}

function generateUniqueId() {
  // Implement your ID generation logic
  return 'unique-id-' + Date.now();
}
