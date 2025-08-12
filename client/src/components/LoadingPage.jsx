import bgImage from "../assets/loginbackground.jpg";

const LoadingPage = () => {
  return (
    <div
      className="h-screen w-screen flex bg-cover bg-center items-center justify-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
          <p className="text-purple-200 text-sm">Please wait while we prepare your dashboard</p>
          
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;