import React from "react";
import { useNavigate } from "react-router-dom";

const CaseTrackingSystem = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth tokens or session data here if needed
    navigate("/home");
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-600 via-orange-400 to-red-300 relative">
      {/* Outer Container (Glassmorphism Card) */}
      <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-5xl w-full h-full flex flex-col relative">
        {/* Title */}
        <h1 className="text-5xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
          Case Tracking System
        </h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-8 bg-white/30 text-gray-900 font-semibold px-5 py-2 rounded-full hover:bg-white/50 transition-shadow shadow-md z-10 cursor-pointer"
        >
          Logout
        </button>

        {/* Iframe Container */}
        <div className="flex-1 flex mt-2">
          <iframe
            src="https://app.relevanceai.com/agents/d7b62b/29d7a76a3356-4377-881e-b1352b2e0de7/51b54c97-af00-4197-8a9b-f3fb036168ab/embed-chat?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=true"
            className="w-full rounded-xl"
            style={{ border: "none" }}
            title="Case Tracking System"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default CaseTrackingSystem;
