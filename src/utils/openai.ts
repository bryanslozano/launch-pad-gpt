import axios from 'axios'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export async function callOpenAI(message: string, customGPTInfo: string): Promise<string> {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: `You are a helpful AI assistant. ${customGPTInfo}` },
          { role: 'user', content: message }
        ],
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    throw error
  }
}

export async function generateDocument(documentType: string, content: string): Promise<string> {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: `You are an AI assistant that generates ${documentType}s.` },
          { role: 'user', content: `Generate a ${documentType} based on the following content or instructions: ${content}` }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating document with OpenAI API:', error)
    throw error
  }
}