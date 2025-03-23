import React from "react";
import { useNavigate } from "react-router-dom";

const LegalAwarenessChatbot = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally clear any auth tokens or state here
    navigate("/home");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-orange-100 to-green-100 px-[16vw] relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-5 right-[16vw] bg-white/80 text-gray-800 font-semibold px-4 py-2 rounded-full shadow-md hover:bg-white transition"
      >
        Logout
      </button>

      <div className="flex-grow text-center p-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Legal Awareness Chatbot</h1>
        <iframe 
          src="https://www.chatbase.co/chatbot-iframe/c7WIqPN9sS9N2r2yHwQoy"
          width="100%"
          style={{ height: "calc(100vh - 200px)", minHeight: "600px", border: "none" }}
          title="Legal Awareness Chatbot"
        ></iframe>
      </div>
      
      {/* Custom Footer */}
      <footer className="p-4 text-black text-center">
        <p className="text-lg font-semibold">© 2024 Judicare - Your Legal Assistant</p>
      </footer>
    </div>
  );
};

export default LegalAwarenessChatbot;
