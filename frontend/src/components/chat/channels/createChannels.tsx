import React, { useEffect, useState } from 'react'
import { userProps } from '@/interface/data'

export default function Channels({ currentUser }: { currentUser: userProps }) {

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');

  const handleClick = async (id: number) => {
    await fetch(`http://localhost:3333/chat/create/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name": name,
        "type": 'protected',
        "description": description,
        "password": password
      }),
      credentials: 'include',
    });
  };



  return (
    <>
      <div className='flex h-screen'>
        <div className="flex-auto w-32 bg-cust">
          <h1 className="text-2xl font-bold mb-4">Channels</h1>
          <div className="mb-4 flex-auto w-32 bg-cust">
            <input
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md"
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md"
              type="text"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md"
              type="text"
              placeholder="description"
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-r-md"
              onClick={() => handleClick(currentUser.id)}
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
