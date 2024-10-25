import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { judge0Config } from '../config/judge0Config';
import Tesseract from 'tesseract.js'; // Import Tesseract.js
import axios from 'axios'; // Import axios

const IDE = ({ onTyping, onStopTyping, videoRef, canvasRef }) => {
  const [code, setCode] = useState('print("Hello World!")');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('71');
  const [imageOutput, setImageOutput] = useState(null);
  const [autoPause, setAutoPause] = useState(true);
  const typingTimeoutRef = useRef(null);

  const languages = [
    { id: '89', name: 'Python (PyPy 3.9)', alias: 'python' },
    { id: '71', name: 'Python', alias: 'python' },
    { id: '62', name: 'Java', alias: 'java' },
    { id: '50', name: 'C', alias: 'c' },
    { id: '54', name: 'C++', alias: 'cpp' },
    { id: '63', name: 'JavaScript', alias: 'javascript' }
  ];

  const runCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': judge0Config.rapidApiKey
        },
        body: JSON.stringify({
          source_code: code,
          language_id: parseInt(language),
          stdin: '',
        })
      });
      
      const result = await response.json();
      console.log('Result:', result);

      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(`Error: ${result.stderr}`);
      } else if (result.compile_output) {
        setOutput(`Compilation Error: ${result.compile_output}`);
      } else if (result.message) {
        setOutput(`Message: ${result.message}`);
      } else {
        setOutput('No output generated');
      }
    } catch (error) {
      console.error('Error:', error);
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // File extension mapping
  const getFileExtension = (langId) => {
    const extensions = {
      '71': '.py',
      '89': '.py',
      '62': '.java',
      '50': '.c',
      '54': '.cpp',
      '63': '.js'
    };
    return extensions[langId] || '.txt';
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      const notification = document.createElement('div');
      notification.textContent = 'Code copied!';
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        animation: fadeOut 2s forwards;
        z-index: 1000;
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleReset = () => {
    setCode(''); // Clear the code editor
  };

  const handleExtract = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/png');
      const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng');
      console.log('Extracted Text:', text);

      // Use Mistral API to process the extracted text
      try {
        const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
          model: 'mistral-large-latest',
          messages: [{ role: 'user', content: text }]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer qIvpHcAmhpIGpbR5TCpvMSs0xR5jxRLd`
          }
        });

        const aiResponse = response.data.choices[0].message.content || "No code extracted.";
        setCode(aiResponse);
      } catch (error) {
        console.error('Error fetching AI response:', error);
      }
    }
  };

  // Get current language alias for Monaco Editor
  const getCurrentLanguage = () => {
    const lang = languages.find(l => l.id === language);
    return lang?.alias || 'plaintext';
  };

  const handleEditorChange = (value) => {
    setCode(value);
    if (autoPause) {
      onTyping && onTyping();
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping && onStopTyping();
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-richblack-900 p-4">
      <div className="space-y-4">
        <div className="flex gap-4">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border rounded-md bg-richblack-800 text-richblack-25"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            onClick={runCode}
            disabled={isLoading}
            className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100 disabled:bg-richblack-700"
          >
            {isLoading ? 'Running...' : 'Run Code'}
          </button>
        </div>
        
        <div className="h-[300px] border rounded-md overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="python"
            language={getCurrentLanguage()}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              formatOnType: true,
              formatOnPaste: true,
              suggestOnTriggerCharacters: true,
              tabSize: 4,
              autoIndent: 'full',
              wordWrap: 'on'
            }}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoPause"
            checked={autoPause}
            onChange={(e) => setAutoPause(e.target.checked)}
            className="w-4 h-4 text-yellow-50 bg-richblack-800 border-richblack-700 rounded focus:ring-yellow-50"
          />
          <label htmlFor="autoPause" className="text-sm text-richblack-25">
            Auto-pause video while typing
          </label>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-richblack-700 text-richblack-25 rounded-md hover:bg-richblack-600 text-sm"
          >
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-richblack-700 text-richblack-25 rounded-md hover:bg-richblack-600 text-sm"
          >
            Download
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
          >
            Reset
          </button>
          <button
            onClick={handleExtract}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Extract
          </button>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-richblack-25">Output:</h3>
          {imageOutput ? (
            <div className="p-4 bg-richblack-800 rounded-md">
              <img 
                src={imageOutput} 
                alt="Output" 
                className="max-w-full"
              />
            </div>
          ) : (
            <pre className="p-4 bg-richblack-800 rounded-md overflow-x-auto text-richblack-25 whitespace-pre-wrap">
              {output || 'Output will appear here...'}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDE;
