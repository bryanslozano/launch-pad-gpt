import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'

interface FileUploadProps {
  onUpload: (file: File) => void
  onClose: () => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onClose }) => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload File</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            <Upload className="h-5 w-5 mr-2 inline" />
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileUpload