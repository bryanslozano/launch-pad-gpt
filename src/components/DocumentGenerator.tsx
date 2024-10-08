import React, { useState } from 'react'
import { FileText, X } from 'lucide-react'

interface DocumentGeneratorProps {
  onGenerate: (documentType: string, content: string) => void
  onClose: () => void
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ onGenerate, onClose }) => {
  const [documentType, setDocumentType] = useState('')
  const [content, setContent] = useState('')

  const handleGenerate = () => {
    if (documentType && content) {
      onGenerate(documentType, content)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Generate Document</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select document type</option>
          <option value="report">Report</option>
          <option value="summary">Summary</option>
          <option value="analysis">Analysis</option>
        </select>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter document content or instructions"
          className="w-full mb-4 p-2 border rounded h-32"
        />
        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={!documentType || !content}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            <FileText className="h-5 w-5 mr-2 inline" />
            Generate
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentGenerator