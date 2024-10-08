import React, { useState, useRef, useEffect } from 'react'
import { Send, Upload, FileText } from 'lucide-react'
import { User, Message } from '../types'
import { callOpenAI, generateDocument } from '../utils/openai'
import FileUpload from './FileUpload'
import DocumentGenerator from './DocumentGenerator'
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

interface ChatInterfaceProps {
  currentUser: User
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showDocumentGenerator, setShowDocumentGenerator] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
    }
    setMessages(prevMessages => [...prevMessages, newMessage])
    setInputMessage('')

    try {
      const response = await callOpenAI(inputMessage, currentUser.customGPTInfo)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'gpt',
      }
      setMessages(prevMessages => [...prevMessages, aiMessage])
    } catch (error) {
      console.error('Error calling OpenAI:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'gpt',
      }
      setMessages(prevMessages => [...prevMessages, errorMessage])
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleFileUpload = async (file: File) => {
    if (!storage) {
      console.error('Firebase storage is not initialized')
      return
    }

    const storageRef = ref(storage, `uploads/${currentUser.id}/${file.name}`)
    try {
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      const fileMessage: Message = {
        id: Date.now().toString(),
        content: `File uploaded: ${file.name}\nDownload URL: ${downloadURL}`,
        sender: 'user',
      }
      setMessages(prevMessages => [...prevMessages, fileMessage])
    } catch (error) {
      console.error('Error uploading file:', error)
    }
    setShowFileUpload(false)
  }

  const handleGenerateDocument = async (documentType: string, content: string) => {
    try {
      const generatedDocument = await generateDocument(documentType, content)
      const documentMessage: Message = {
        id: Date.now().toString(),
        content: `Generated ${documentType}:\n\n${generatedDocument}`,
        sender: 'gpt',
      }
      setMessages(prevMessages => [...prevMessages, documentMessage])
    } catch (error) {
      console.error('Error generating document:', error)
    }
    setShowDocumentGenerator(false)
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-md">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-grow mr-2 p-2 border rounded"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            <Send className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowFileUpload(true)}
            className="ml-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            <Upload className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowDocumentGenerator(true)}
            className="ml-2 bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
          >
            <FileText className="h-5 w-5" />
          </button>
        </div>
      </div>
      {showFileUpload && (
        <FileUpload onUpload={handleFileUpload} onClose={() => setShowFileUpload(false)} />
      )}
      {showDocumentGenerator && (
        <DocumentGenerator
          onGenerate={handleGenerateDocument}
          onClose={() => setShowDocumentGenerator(false)}
        />
      )}
    </div>
  )
}

export default ChatInterface