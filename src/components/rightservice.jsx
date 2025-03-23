import React from 'react';
import { useNavigate } from 'react-router-dom';

const JudiciaryServices = (props) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/summarizer');
    };

    return (
        <div className="min-h-[calc(100vh-17rem)] flex flex-col md:flex-row items-center justify-between p-30 bg-gradient-to-b from-orange-200 to-green-200 box-border">
            {/* Left Side - Description */}
            <div className="md:w-1/2 text-center md:text-left mt-8 md:mt-0">
                <h2 className="text-5xl font-bold text-gray-800 mb-6">{props.name}</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {props.desc1}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                    {props.desc2}
                </p>
            </div>

            {/* Right Side - Image and Button */}
            <div className="flex flex-col items-end md:items-end md:w-1/2 space-y-8">
                <img 
                    src={props.img} 
                    alt="Chatbot" 
                    className="w-64 h-64 object-contain hover:scale-105 transition-transform duration-300" 
                />
                <button 
                    onClick={handleButtonClick}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1 mr-12 cursor-pointer"
                >
                    {props.title1}
                </button>
            </div>
        </div>
    );
};

export default JudiciaryServices;