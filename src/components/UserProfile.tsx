import React, { useState } from 'react'
import { User } from '../types'

interface UserProfileProps {
  user: User
  onUpdateUser: (updatedUser: User) => void
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser }) => {
  const [editing, setEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)

  const handleSave = () => {
    onUpdateUser(editedUser)
    setEditing(false)
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      {editing ? (
        <>
          <input
            type="text"
            value={editedUser.name}
            onChange={e => setEditedUser({ ...editedUser, name: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="email"
            value={editedUser.email}
            onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            readOnly
          />
          <textarea
            value={editedUser.customGPTInfo}
            onChange={e => setEditedUser({ ...editedUser, customGPTInfo: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            rows={4}
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Custom GPT Info:</strong> {user.customGPTInfo}</p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  )
}

export default UserProfile