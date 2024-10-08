export interface User {
  id: string
  name: string
  email: string
  customGPTInfo: string
}

export interface Message {
  id: string
  content: string
  sender: 'user' | 'gpt'
}