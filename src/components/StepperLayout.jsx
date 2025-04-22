const tabs = [
    "Basic Info",
    "Education Info",
    "Experience Info",
    "Social Media",
    "Skills & Languages",
    "Projects",
    "Template",
    "Download",
  ];
  
  const StepperLayout = ({ currentStep, children, onNext, onBack }) => {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-md">
        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="bg-orange-500 h-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tabs.length) * 100}%` }}
          ></div>
        </div>
  
        {/* Başlık */}
        <h1 className="text-3xl font-bold text-center mb-8">
          Tell us a little about yourself
        </h1>
  
        {/* Sekmeler */}
        <div className="flex flex-wrap gap-4 justify-center border-b mb-8">
          {tabs.map((label, index) => (
            <button
              key={label}
              className={`pb-2 border-b-2 text-sm font-medium ${
                index === currentStep
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500"
              }`}
              disabled
            >
              {label}
            </button>
          ))}
        </div>
  
        {/* İçerik */}
        <div>{children}</div>
  
        {/* Butonlar */}
        <div className="flex justify-between mt-10">
          <button
            onClick={onBack}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-orange-500 rounded-lg text-orange-500 hover:bg-orange-50 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  
  export default StepperLayout;
  