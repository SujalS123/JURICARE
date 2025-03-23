import React from 'react';
import ashokStambh from '../assets/ashokstambh.png';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-300 to-green-300 flex flex-col items-center justify-center text-center p-8">
            {/* Enlarged Ashok Stambh Image */}
            <img src={ashokStambh} alt="Ashok Stambh" className="w-48 h-48 mb-8" />

            {/* Killer Description */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">Justice Made Simple</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-12">
                Empowering citizens with quick case resolutions and simplified access to the Indian Constitution. Explore a smarter, faster legal system today!
            </p>

            {/* Services Section */}
            <div className="flex flex-wrap justify-center gap-8">
                <div className="bg-white shadow-lg rounded-2xl p-6 w-72 hover:scale-105 transition-transform relative group cursor-pointer">
                    <h2 className="text-xl font-semibold mb-4">Case Tracker</h2>
                    <p className="text-gray-600">Stay updated with real-time progress on your legal cases—never miss an important update again</p>
                    
                    {/* Case Tracker Tooltip */}
                    <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white p-4 rounded-lg w-80 -top-24 left-1/2 transform -translate-x-1/2 text-sm shadow-lg">
                        Advanced Case Tracking Features:
                        <ul className="list-disc list-inside mt-2 text-left">
                            <li>Real-time case status updates</li>
                            <li>Hearing date notifications</li>
                            <li>Document submission deadlines</li>
                            <li>Court schedule management</li>
                        </ul>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-black"></div>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-6 w-72 hover:scale-105 transition-transform relative group cursor-pointer">
                    <h2 className="text-xl font-semibold mb-4">Case Summarizer</h2>
                    <p className="text-gray-600">Quickly understand complex legal cases with clear, concise summaries—saving you time and effort!</p>
                    
                    {/* Case Summarizer Tooltip */}
                    <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white p-4 rounded-lg w-80 -top-24 left-1/2 transform -translate-x-1/2 text-sm shadow-lg">
                        Summarizer Tools Include:
                        <ul className="list-disc list-inside mt-2 text-left">
                            <li>AI-powered case analysis</li>
                            <li>Key points extraction</li>
                            <li>Previous judgment references</li>
                            <li>Similar case comparisons</li>
                        </ul>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-black"></div>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-6 w-72 hover:scale-105 transition-transform relative group cursor-pointer">
                    <h2 className="text-xl font-semibold mb-4">Understanding the Constitution</h2>
                    <p className="text-gray-600">Simplifying complex legal jargon into clear, easy-to-understand language for everyone</p>
                    
                    {/* Constitution Tooltip */}
                    <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white p-4 rounded-lg w-80 -top-24 left-1/2 transform -translate-x-1/2 text-sm shadow-lg">
                        Constitutional Learning Tools:
                        <ul className="list-disc list-inside mt-2 text-left">
                            <li>Interactive article explanations</li>
                            <li>Simplified legal terminology</li>
                            <li>Real-world case examples</li>
                            <li>Amendment history tracker</li>
                        </ul>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-black"></div>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-6 w-72 hover:scale-105 transition-transform relative group cursor-pointer">
                    <h2 className="text-xl font-semibold mb-4">Legal Chatbot</h2>
                    <p className="text-gray-600">Get answers to your legal queries instantly through our intelligent chatbot.</p>
                    
                    {/* Existing Chatbot Tooltip */}
                    <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white p-4 rounded-lg w-80 -top-24 left-1/2 transform -translate-x-1/2 text-sm shadow-lg">
                        Our AI-powered Legal Chatbot provides:
                        <ul className="list-disc list-inside mt-2 text-left">
                            <li>24/7 instant legal guidance</li>
                            <li>Simplified legal term explanations</li>
                            <li>Basic case law references</li>
                            <li>Document filing assistance</li>
                        </ul>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-black"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
