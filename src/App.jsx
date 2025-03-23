import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Navbar from "./components/navbar"; // Renamed from Navbar
import LegalAwarenessChatbot from "./components/chatbot";
import Casetracker from "./components/casetracking"
import Summarizer from "./components/summarizer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Navbar />} />
        <Route path="/legalbot" element={<LegalAwarenessChatbot />} />
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/casetracker" element={<Casetracker />} />
      </Routes>
    </Router>
  );
}

export default App;
