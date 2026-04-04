import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Group, Panel, Separator } from 'react-resizable-panels';
import ResultCard from './components/ResultCard';
import ProblemInput from './components/ProblemInput';
import './index.css';

// 1. Define default snippets for each language
const defaultSnippets = {
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            int complement = target - nums[i];
            if (numMap.count(complement)) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        numMap = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in numMap:
                return [numMap[complement], i]
            numMap[num] = i
        return []`,
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`
};

function App() {
  const [activeTab, setActiveTab] = useState('code');
  const [problemStatement, setProblemStatement] = useState('');
  
  // 2. Initialize code state with the Java snippet
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState(defaultSnippets['java']);
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const sanitizedCode = code.replace(/\r/g, '');
        const response = await axios.post(`${apiUrl}/analyze`, { problemStatement, code: sanitizedCode});
        setResults(response.data);
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handler to change language AND update the code snippet
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(defaultSnippets[newLang]);
  };

  return (
    <div className="h-screen w-full bg-[#000000] flex flex-col overflow-hidden text-gray-300 font-sans">
      
      {/* Top Navbar */}
      <header className="shrink-0 px-6 py-2.5 bg-[#0a0a0a] flex items-center justify-between border-b border-[#333]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-orange-500/20 text-orange-500 rounded flex items-center justify-center font-bold text-sm">
            {'</>'}
          </div>
          <h1 className="text-base font-semibold text-gray-200">Code Analyzer</h1>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-[#2cbb5d] hover:bg-[#23994c] disabled:bg-[#2cbb5d]/40 disabled:text-gray-400 text-white py-1.5 px-4 rounded-md font-medium text-sm transition-all flex items-center gap-2"
        >
          {loading ? (
            <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Running</>
          ) : (
             'Run Analysis'
          )}
        </button>
      </header>

      <main className="flex-1 min-h-0 w-full p-2">
        <Group direction={isMobile ? "vertical" : "horizontal"} className="h-full">
          
          <Panel defaultSize={55} minSize={30} className="bg-[#262626] rounded-lg border border-[#3e3e42] flex flex-col overflow-hidden shadow-lg">
              
              <div className="flex items-center bg-[#333333] h-10 shrink-0 overflow-x-auto custom-scrollbar px-2 gap-1">
                <button
                  onClick={() => setActiveTab('problem')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'problem' ? 'bg-[#404040] text-white' : 'text-gray-400 hover:bg-[#404040]/50 hover:text-gray-200'}`}
                >
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'code' ? 'bg-[#404040] text-white' : 'text-gray-400 hover:bg-[#404040]/50 hover:text-gray-200'}`}
                >
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  Code Editor
                </button>
              </div>

              <div className="flex-1 min-h-0 relative bg-[#1e1e1e]">
                {activeTab === 'problem' && (
                  <div className="absolute inset-0">
                    <ProblemInput value={problemStatement} onChange={setProblemStatement} />
                  </div>
                )}
                {activeTab === 'code' && (
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex items-center px-4 py-2 shrink-0 bg-[#262626] border-b border-[#3e3e42]">
                      <select
                        value={language}
                        onChange={handleLanguageChange} // 4. Attach new handler here
                        className="bg-[#333333] hover:bg-[#404040] cursor-pointer border border-[#4a4a4a] text-gray-200 text-xs rounded px-2 py-1 outline-none transition-colors"
                      >
                        {/* 5. Fixed the labels to match their values */}
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python 3</option>
                        <option value="javascript">JavaScript</option>
                      </select>
                    </div>
                    <div className="flex-1 min-h-0 pt-3">
                      <Editor
                        height="100%"
                        width="100%"
                        language={language}
                        value={code}
                        theme="vs-dark"
                        onChange={(v) => setCode(v || '')}
                        options={{ 
                          automaticLayout: true, 
                          minimap: { enabled: false },
                          fontSize: 14,
                          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
           </Panel>

            <Separator className="w-2 relative group flex items-center justify-center cursor-col-resize z-10 bg-transparent hover:bg-transparent active:bg-transparent">
                <div className="w-0.5 h-8 bg-[#5c5c5c] rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-100"></div>
            </Separator>
           
           <Panel defaultSize={45} minSize={25} className="bg-[#262626] rounded-lg border border-[#3e3e42] flex flex-col overflow-hidden shadow-lg">
              <div className="flex items-center bg-[#333333] h-10 px-4 shrink-0">
                 <h2 className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                   <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Analysis Results
                 </h2>
              </div>
              
              <div className="flex-1 bg-[#1e1e1e] overflow-y-auto p-4 custom-scrollbar relative">
                
                {loading && results && (
                  <div className="absolute inset-0 z-10 bg-[#1e1e1e]/70 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-[#262626] px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-[#3e3e42]">
                      <div className="w-5 h-5 border-2 border-[#2cbb5d]/30 border-t-[#2cbb5d] rounded-full animate-spin"></div>
                      <span className="text-sm font-medium text-gray-300">Evaluating...</span>
                    </div>
                  </div>
                )}

                {loading && !results && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                     <div className="w-8 h-8 border-2 border-[#2cbb5d]/30 border-t-[#2cbb5d] rounded-full animate-spin"></div>
                     <p className="text-xs font-medium animate-pulse">Analyzing logic and complexity...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm flex items-start gap-2">
                     <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                {!loading && !results && !error && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 opacity-70">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    <p className="text-sm">Submit code to view metrics</p>
                  </div>
                )}

                {results && (
                  <div className="space-y-4 animate-slideIn pb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <ResultCard label="Time Complexity" value={results.timeComplexity} icon="⏱️" />
                      <ResultCard label="Space Complexity" value={results.spaceComplexity} icon="💾" />
                    </div>
                    
                    <div className="bg-[#2a2a2a] border border-[#3e3e42] p-3 rounded-lg flex items-center justify-between shadow-sm">
                      <div className="text-xs font-medium text-gray-400">Optimality</div>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${results.isOptimal ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {results.isOptimal ? '✓ Optimal' : '✗ Suboptimal'}
                      </span>
                    </div>

                    <ResultCard label="Suggested Pattern" value={results.suggestedPattern} icon="🧩" fullWidth={true} />
                    
                    <div className="bg-[#2a2a2a] border border-[#3e3e42] p-4 rounded-lg shadow-sm">
                      <div className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <span>🤖</span> Breakdown
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{results.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
           </Panel>
        </Group>
      </main>
    </div>
  );
}

export default App;