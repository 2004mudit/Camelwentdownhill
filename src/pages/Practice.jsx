import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TomatoPomodoroWidget from '../components/TomatoPomodoroWidget';
import AIChatWidget from '../components/AIChatWidget'; // Import the AI Chat Widget

const sampleQuestions = [
  {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    sampleInput: "[2,7,11,15]\n9",
    sampleOutput: "[0,1]",
    testCases: [
      { input: "[2,7,11,15]\n9", output: "[0,1]" },
      { input: "[3,2,4]\n6", output: "[1,2]" },
    ],
  },
  {
    id: 2,
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    sampleInput: '["h","e","l","l","o"]',
    sampleOutput: '["o","l","l","e","h"]',
    testCases: [
      { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
  },
  {
    id: 3,
    title: "Palindrome Number",
    description: "Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.",
    sampleInput: "121",
    sampleOutput: "true",
    testCases: [
      { input: "121", output: "true" },
      { input: "-121", output: "false" },
    ],
  },
  {
    id: 4,
    title: "Roman to Integer",
    description: "Convert a Roman numeral to an integer.",
    sampleInput: "III",
    sampleOutput: "3",
    testCases: [
      { input: "III", output: "3" },
      { input: "IV", output: "4" },
    ],
  },
  {
    id: 5,
    title: "Longest Common Prefix",
    description: "Write a function to find the longest common prefix string amongst an array of strings.",
    sampleInput: '["flower","flow","flight"]',
    sampleOutput: '"fl"',
    testCases: [
      { input: '["flower","flow","flight"]', output: '"fl"' },
      { input: '["dog","racecar","car"]', output: '""' },
    ],
  },
  {
    id: 6,
    title: "Valid Parentheses",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    sampleInput: '"()"',
    sampleOutput: "true",
    testCases: [
      { input: '"()"', output: "true" },
      { input: '"(]"', output: "false" },
    ],
  },
  {
    id: 7,
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists and return it as a new sorted list.",
    sampleInput: "[1,2,4]\n[1,3,4]",
    sampleOutput: "[1,1,2,3,4,4]",
    testCases: [
      { input: "[1,2,4]\n[1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "[]\n[]", output: "[]" },
    ],
  },
  {
    id: 8,
    title: "Remove Duplicates from Sorted Array",
    description: "Remove duplicates in-place from a sorted array and return the new length.",
    sampleInput: "[1,1,2]",
    sampleOutput: "2",
    testCases: [
      { input: "[1,1,2]", output: "2" },
      { input: "[0,0,1,1,1,2,2,3,3,4]", output: "5" },
    ],
  },
  {
    id: 9,
    title: "Remove Element",
    description: "Remove all instances of a value in-place and return the new length.",
    sampleInput: "[3,2,2,3]\n3",
    sampleOutput: "2",
    testCases: [
      { input: "[3,2,2,3]\n3", output: "2" },
      { input: "[0,1,2,2,3,0,4,2]\n2", output: "5" },
    ],
  },
  {
    id: 10,
    title: "Implement strStr()",
    description: "Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.",
    sampleInput: '"hello"\n"ll"',
    sampleOutput: "2",
    testCases: [
      { input: '"hello"\n"ll"', output: "2" },
      { input: '"aaaaa"\n"bba"', output: "-1" },
    ],
  },
  {
    id: 11,
    title: "Search Insert Position",
    description: "Given a sorted array and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    sampleInput: "[1,3,5,6]\n5",
    sampleOutput: "2",
    testCases: [
      { input: "[1,3,5,6]\n5", output: "2" },
      { input: "[1,3,5,6]\n2", output: "1" },
    ],
  },
];

function Practice() {
  const [questions, setQuestions] = useState(sampleQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const selectQuestion = (question) => {
    setSelectedQuestion(question);
    setCode('');
    setOutput('');
    setIsCorrect(null);
  };

  const runCode = async () => {
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: {
        base64_encoded: 'false',
        fields: '*'
      },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'aa85d77aaemsh4f83ddb6a6b0823p194984jsnb550dd890c10',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: {
        language_id: 71, // Python
        source_code: code,
        stdin: selectedQuestion.testCases[0].input
      }
    };

    try {
      const response = await axios.request(options);
      const token = response.data.token;
      
      // Poll for results
      const result = await pollForResult(token);
      setOutput(result.stdout || result.stderr || 'No output');
      
      // Check if the output matches the expected output
      const isCorrect = result.stdout.trim() === selectedQuestion.testCases[0].output.trim();
      setIsCorrect(isCorrect);
    } catch (error) {
      console.error(error);
      setOutput('Error occurred while running the code');
    }
  };

  const pollForResult = async (token) => {
    const options = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: {
        base64_encoded: 'false',
        fields: '*'
      },
      headers: {
        'X-RapidAPI-Key': 'aa85d77aaemsh4f83ddb6a6b0823p194984jsnb550dd890c10',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    };

    while (true) {
      const response = await axios.request(options);
      if (response.data.status.id > 2) { // 1: In Queue, 2: Processing
        return response.data;
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-richblack-800 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-richblack-25">Questions</h2>
        {questions.map((q) => (
          <div
            key={q.id}
            className={`p-2 mb-2 cursor-pointer ${
              selectedQuestion && selectedQuestion.id === q.id
                ? 'bg-richblack-700 text-richblack-25'
                : 'text-richblack-300 hover:bg-richblack-700'
            }`}
            onClick={() => selectQuestion(q)}
          >
            {q.title}
          </div>
        ))}
      </div>
      <div className="w-3/4 p-4 bg-richblack-900">
        {selectedQuestion ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-richblack-25">{selectedQuestion.title}</h2>
            <p className="mb-4 text-richblack-100">{selectedQuestion.description}</p>
            <div className="mb-4">
              <h3 className="font-bold text-richblack-50">Sample Input:</h3>
              <pre className="bg-richblack-800 p-2 rounded text-white">{selectedQuestion.sampleInput}</pre>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-richblack-50">Sample Output:</h3>
              <pre className="bg-richblack-800 p-2 rounded text-white">{selectedQuestion.sampleOutput}</pre>
            </div>
            <textarea
              className="w-full h-64 p-2 mb-4 bg-richblack-800 text-richblack-25 rounded"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
            />
            <button
              className="bg-yellow-50 text-richblack-900 px-4 py-2 rounded"
              onClick={runCode}
            >
              Run Code
            </button>
            {output && (
              <div className="mt-4">
                <h3 className="font-bold text-richblack-50">Output:</h3>
                <pre className="bg-richblack-800 p-2 rounded text-richblack-25">{output}</pre>
              </div>
            )}
            {isCorrect !== null && (
              <div className={`mt-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect. Try again.'}
              </div>
            )}
          </>
        ) : (
          <p className="text-richblack-100">Select a question to start practicing.</p>
        )}
      </div>

      {/* Add Pomodoro and AI Chat Widgets */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-4">
        <AIChatWidget />
        <TomatoPomodoroWidget />
      </div>
    </div>
  );
}

export default Practice;
