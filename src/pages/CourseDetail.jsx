import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import IDE from '../components/IDE';
import TomatoPomodoroWidget from '../components/TomatoPomodoroWidget';
import AIChatWidget from '../components/AIChatWidget';

const courseData = {
  cpp_intro: {
    title: "Introduction to C++",
    videos: [
      {
        title: "1. Getting Started with C++",
        url: "/videos/cpp/video1.mp4"
      },
      {
        title: "2. Variables and Data Types",
        url: "/videos/cpp/video2.mp4"
      },
      {
        title: "3. Control Structures",
        url: "/videos/cpp/video3.mp4"
      }
    ],
    codeSnippet: `#include <iostream>
// ... rest of the code ...`
  },
  html_css_advanced: {
    title: "Advanced HTML & CSS",
    videos: [
      {
        title: "1. Advanced Selectors",
        url: "/videos/html-css/video1.mp4"
      },
      {
        title: "2. Flexbox Deep Dive",
        url: "/videos/html-css/video2.mp4"
      },
      {
        title: "3. CSS Grid Mastery",
        url: "/videos/html-css/video3.mp4"
      }
    ],
    codeSnippet: `<!DOCTYPE html>
// ... rest of the code ...`
  },
  // ... other courses
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courseData[id] || courseData.cpp_intro;
  const [isBlurred, setIsBlurred] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaylistCollapsed, setIsPlaylistCollapsed] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleSubmit = () => {
    navigate('/practice');
  };

  const goToNextVideo = () => {
    if (currentVideoIndex < course.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const goToPrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#151d29', color: 'white' }}>
        <div style={{ width: '100%', position: 'relative', paddingBottom: '56.25%' }}>
          <video
            ref={videoRef}
            src={course.videos[currentVideoIndex].url}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            controls
            autoPlay
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="360"></canvas>
        </div>

        <div style={{ 
          padding: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={goToPrevVideo}
            disabled={currentVideoIndex === 0}
            className="p-2 text-white disabled:opacity-50 hover:bg-richblack-700 rounded"
          >
            <FaArrowLeft />
          </button>
          
          <h3 className="text-xl font-semibold text-center flex-1 px-4">
            {course.videos[currentVideoIndex].title}
          </h3>
          
          <button
            onClick={goToNextVideo}
            disabled={currentVideoIndex === course.videos.length - 1}
            className="p-2 text-white disabled:opacity-50 hover:bg-richblack-700 rounded"
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Collapsible Playlist */}
        <div className="p-4 flex-1 overflow-auto">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsPlaylistCollapsed(!isPlaylistCollapsed)}
          >
            <h4 className="text-lg font-semibold">Course Videos</h4>
            {isPlaylistCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </div>
          {!isPlaylistCollapsed && (
            <div className="space-y-2 mt-2">
              {course.videos.map((video, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={`p-3 rounded cursor-pointer transition-all ${
                    currentVideoIndex === index
                      ? 'bg-richblack-700 text-yellow-50'
                      : 'hover:bg-richblack-800 text-richblack-25'
                  }`}
                >
                  {video.title}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-richblack-700">
          <div 
            onClick={() => setIsBlurred(false)}
            className="relative bg-richblack-800 rounded-md p-4 mb-4"
          >
            <pre className="text-sm text-richblack-25 overflow-x-auto">
              {course.codeSnippet}
            </pre>
            {isBlurred && (
              <div className="absolute inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center cursor-pointer">
                <p className="text-white text-lg">Click to reveal code</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100"
          >
            Practice Now
          </button>
        </div>
      </div>

      <div style={{ flex: '0 0 50%', height: '100vh', backgroundColor: '#1e1e1e' }}>
        <IDE 
          onTyping={pauseVideo} 
          onStopTyping={playVideo}
          videoRef={videoRef}
          canvasRef={canvasRef}
        />
      </div>

      {/* Only Pomodoro and AI Chat Widgets */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-4">
        <AIChatWidget />
        <TomatoPomodoroWidget />
      </div>
    </div>
  );
};

export default CourseDetail;
