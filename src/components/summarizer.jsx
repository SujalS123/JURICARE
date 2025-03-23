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
        ChatterDoc
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
        <iframe src="https://app.relevanceai.com/agents/d7b62b/5dcdfbbf555c-4ecd-b7be-4bcc6599e2f0/90c3f72f-664d-498c-9c5c-488999c027c0/embed-chat?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false" width="100%" height="100%" frameborder="0"></iframe>
        </div>
      </div>
    </div>
  );
};

export default CaseTrackingSystem;
