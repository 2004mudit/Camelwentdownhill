import React, { useState, useRef } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Loader, Code, Download } from 'lucide-react';
import axios from 'axios';

const CodeExtractor = ({ videoRef, canvasRef }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedCode, setExtractedCode] = useState('');
  const [error, setError] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  const captureFrame = () => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas) {
        console.error('Video or canvas ref is null');
        return null;
      }

      // Get video dimensions
      const videoWidth = video.videoWidth || video.offsetWidth;
      const videoHeight = video.videoHeight || video.offsetHeight;

      // Calculate crop dimensions
      const cropDimensions = {
        x: Math.floor(videoWidth * 0.10), // Start after line numbers (10% from left)
        y: Math.floor(videoHeight * 0.15), // Start after tab header (15% from top)
        width: Math.floor(videoWidth * 0.55), // End before Solution Explorer (65% - 10% from left)
        height: Math.floor(videoHeight * 0.35), // End at last visible line (50% - 15% from top)
      };

      console.log('Crop dimensions:', cropDimensions);
      
      // Set canvas size to match the cropped dimensions
      canvas.width = cropDimensions.width;
      canvas.height = cropDimensions.height;
      
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw only the cropped portion of the video
      context.drawImage(
        video,
        cropDimensions.x, // Source X
        cropDimensions.y, // Source Y
        cropDimensions.width, // Source Width
        cropDimensions.height, // Source Height
        0, // Destination X
        0, // Destination Y
        canvas.width, // Destination Width
        canvas.height // Destination Height
      );
      
      const imageData = canvas.toDataURL('image/png', 1.0);
      console.log('Cropped image captured, size:', imageData.length);
      
      setCapturedImage(imageData);
      return imageData;
    } catch (error) {
      console.error('Error capturing frame:', error);
      return null;
    }
  };

  const saveImage = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `captured-frame-${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const processWithGemini = async (imageData) => {
    try {
      console.log('Processing with Gemini Vision API...');
      
      const base64Image = imageData.split(',')[1];
      
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent',
        {
          contents: [{
            parts: [
              {
                text: "Extract any code visible in this image. Return only the code with proper formatting and indentation. If no code is found, respond with 'No code detected'."
              },
              {
                inlineData: {
                  mimeType: "image/png",
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            topP: 0.1,
            topK: 16,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': 'AIzaSyDTF6cuOy6Q1jInxA772hm7pGeD7x70khY'
          }
        }
      );

      console.log('Gemini Response:', response.data);
      
      if (response.data.candidates && response.data.candidates[0]) {
        const extractedText = response.data.candidates[0].content.parts[0].text;
        // Clean up the response
        return extractedText
          .replace(/```\w*\n?/g, '') // Remove code block markers
          .trim();
      } else {
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API error:', error.response?.data || error);
      throw error;
    }
  };

  const extractCode = async () => {
    try {
      setIsProcessing(true);
      setError('');

      const frameData = captureFrame();
      if (!frameData) {
        throw new Error('Failed to capture frame');
      }
      console.log('Frame captured');

      const processedCode = await processWithGemini(frameData);
      console.log('Code extracted:', processedCode);

      setExtractedCode(processedCode);

    } catch (err) {
      setError('Failed to extract code. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4" style={{ backgroundColor: '#1e1e1e' }}>
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2">
        <Button 
          onClick={extractCode}
          disabled={isProcessing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          style={{ backgroundColor: '#2563eb', color: 'white' }}
        >
          {isProcessing ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Code className="mr-2 h-4 w-4" />
              Extract Code
            </>
          )}
        </Button>

        {capturedImage && (
          <Button
            onClick={saveImage}
            className="bg-green-600 hover:bg-green-700 text-white"
            style={{ backgroundColor: '#059669', color: 'white' }}
            title="Save captured frame"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm font-semibold" style={{ color: '#ef4444' }}>
          {error}
        </div>
      )}

      {capturedImage && (
        <Card className="mt-4" style={{ backgroundColor: '#374151' }}>
          <CardContent className="p-4">
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured frame" 
                className="w-full h-auto rounded-lg"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
              <div className="absolute top-2 right-2">
                <Button
                  onClick={saveImage}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  style={{ backgroundColor: '#059669', color: 'white' }}
                  title="Save captured frame"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {extractedCode && (
        <Card className="mt-4" style={{ backgroundColor: '#374151' }}>
          <CardContent className="p-4">
            <pre 
              className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto"
              style={{ backgroundColor: '#1f2937', color: 'white' }}
            >
              <code>{extractedCode}</code>
            </pre>
            <Button 
              onClick={() => navigator.clipboard.writeText(extractedCode)}
              variant="outline"
              className="mt-2 bg-gray-700 text-white hover:bg-gray-600"
              style={{ backgroundColor: '#4b5563', color: 'white' }}
            >
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeExtractor;
