"use client";
import React, { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    setResponse(''); // Clear previous response

    try {
      const responseStream = await fetch('http://localhost:5000/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const reader = responseStream.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setResponse((prev) => prev + chunk); // Append the chunk to the response
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>GPT Clone</h1>
      <form onSubmit={handlePromptSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          style={{ width: '300px', marginRight: '10px' }}
        />
        <button type="submit">Send</button>
      </form>
      <div style={{ marginTop: '20px' }}>
        <h2>Response:</h2>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{response}</pre>
      </div>
    </div>
  );
}
