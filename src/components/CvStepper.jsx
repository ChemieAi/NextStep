const CvStepper = ({ currentStep, totalSteps }) => {
    return (
      <div className="w-full flex items-center justify-between">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-2 mx-1 rounded ${
              index <= currentStep ? "bg-primary" : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>
    );
  };
  
  export default CvStepper;
  