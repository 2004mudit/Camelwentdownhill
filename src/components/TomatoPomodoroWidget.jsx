import React, { useState, useEffect } from 'react';
import { Timer, X, Play, Pause, RefreshCw, Leaf } from 'lucide-react';

const TomatoPomodoroWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [time, setTime] = useState(25 * 60);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const startTimer = (minutes, isBreakTime = false) => {
    setTime(minutes * 60);
    setIsBreak(isBreakTime);
    setIsRunning(true);
  };

  // Tomato button component
  const TomatoButton = ({ onClick, children }) => (
    <button
      onClick={onClick}
      className={`
        relative
        w-16 h-16
        rounded-full
        ${isBreak ? 'bg-teal-600' : 'bg-red-500'}
        shadow-lg
        transition-all
        hover:scale-105
        group
      `}
    >
      {/* Leaf */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-green-500 transform -rotate-45">
        <Leaf size={16} fill="currentColor" />
      </div>
      {/* Shine effect */}
      <div className="absolute top-1 left-1 w-4 h-4 bg-white/20 rounded-full" />
      {children}
    </button>
  );

  const QuickButton = ({ minutes, label, isBreakBtn = false }) => (
    <button
      onClick={() => startTimer(minutes, isBreakBtn)}
      className={`
        px-2 py-1 
        rounded-full 
        text-xs 
        font-medium 
        transition-all
        ${isBreakBtn ? 
          'bg-white/20 text-white hover:bg-white/30' : 
          'bg-white/20 text-white hover:bg-white/30'
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <TomatoButton onClick={() => setIsOpen(true)}>
          <div className="flex items-center justify-center h-full">
            <Timer className="text-white" size={24} />
          </div>
        </TomatoButton>
      )}

      {isOpen && (
        <div className={`
          relative
          w-64
          rounded-3xl
          overflow-hidden
          shadow-xl
          transition-all
          ${isBreak ? 'bg-teal-600' : 'bg-red-500'}
        `}>
          {/* Leaf decoration */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-green-500 transform -rotate-45">
            <Leaf size={20} fill="currentColor" />
          </div>
          
          {/* Shine effect */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full" />

          {/* Content */}
          <div className="relative">
            {/* Header */}
            <div className="flex justify-between items-center p-3 bg-black/10">
              <h3 className="text-white font-medium text-sm">
                {isBreak ? 'Break Time' : 'Pomodoro'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Timer Display */}
            <div className="p-4 text-center">
              <div className="text-4xl font-bold text-white mb-3">
                {formatTime(time)}
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-2 mb-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  {isRunning ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setTime(25 * 60);
                  }}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  <RefreshCw size={20} />
                </button>
              </div>

              {/* Quick buttons */}
              <div className="grid grid-cols-3 gap-1 text-center">
                <QuickButton minutes={25} label="25m" />
                <QuickButton minutes={5} label="5m" isBreakBtn />
                <QuickButton minutes={10} label="10m" isBreakBtn />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TomatoPomodoroWidget;
