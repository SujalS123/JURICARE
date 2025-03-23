import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ashokstambha from "../assets/ashokstambh.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("citizen");
  const [govId, setGovId] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "signup" : "login";
    const url = `http://localhost:5001/api/${endpoint}`;
    const bodyData = isRegistering
      ? { username, password, userType }
      : { username, password, userType };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      alert(data.message);

      // On successful login, navigate to home page
      if (!isRegistering && response.ok) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-[#FFCC80] via-[#FAFAFA] to-[#A5D6A7]">
      <div className="flex h-[77vh] w-[83vw] bg-[#FFF8E1] rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="hidden lg:flex items-center justify-center w-1/2 bg-white">
          <div className="text-center p-4">
            <img src={ashokstambha} alt="Logo" className="w-32 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              WELCOME TO THE WEBSITE
            </h1>
            <p className="text-gray-600 text-sm">
              Explore a faster and smarter judiciary system with us!
            </p>
          </div>
        </div>
        {/* Right Section */}
        <div className="flex items-center justify-center w-full lg:w-1/2 p-4 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]">
          <div className="bg-[#F3F4F6] px-8 py-8 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-4 text-[#1E3A8A]">
              {isRegistering ? "USER REGISTRATION" : "USER LOGIN"}
            </h2>
            {/* User Type Selection */}
            <div className="flex justify-center mb-4">
              <label className="mr-2">
                <input 
                  type="radio" 
                  value="citizen" 
                  checked={userType === "citizen"}
                  onChange={() => {
                    setUserType("citizen");
                    setGovId("");
                  }}
                />{" "}
                Citizen
              </label>
              <label>
                <input 
                  type="radio" 
                  value="judge" 
                  checked={userType === "judge"}
                  onChange={() => setUserType("judge")}
                />{" "}
                Judge
              </label>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {userType === "judge" && (
                <div>
                  <label className="block text-gray-700">Government ID</label>
                  <input
                    type="text"
                    placeholder="Enter your secret government ID"
                    value={govId}
                    onChange={(e) => setGovId(e.target.value)}
                    required
                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <label>
                  <input type="checkbox" className="mr-1" /> Remember
                </label>
                <a href="#" className="hover:text-purple-600 text-[#1A73E8] hover:underline">
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-[#1A73E8] text-white p-2 rounded-lg hover:bg-[#1558B0] transition cursor-pointer"
              >
                {isRegistering ? "Register" : "Login"}
              </button>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="w-full bg-[#DB4437] text-white p-2 rounded-lg hover:bg-[#C1351D] transition cursor-pointer"
                >
                  {isRegistering ? "Switch to Login" : "Switch to Register"}
                </button>
              </div>
              <p className="text-center mt-2 text-gray-600">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <a
                  href="#"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-[#1A73E8] hover:underline"
                >
                  {isRegistering ? "Login" : "Sign Up"}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
