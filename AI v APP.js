import React, { useState } from 'react';
import axios from 'axios';
import './styles/App.css';

function App() {
  const [text, setText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateVideo = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setProgress(0);

    try {
      const response = await axios.post('http://localhost:5000/generate', { text }, {
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      setVideoUrl(`http://localhost:5000/${response.data.videoPath}`);
    } catch (error) {
      alert("Failed to generate video!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>AI Video Generator</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your script..."
        rows={8}
      />
      <button onClick={generateVideo} disabled={isLoading}>
        {isLoading ? `Generating... (${progress}%)` : "Generate Video"}
      </button>
      {videoUrl && (
        <div className="video-preview">
          <video controls src={videoUrl}></video>
          <a href={videoUrl} download="ai-video.mp4">Download</a>
        </div>
      )}
    </div>
  );
}

export default App;
