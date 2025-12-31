
import { cn } from "@/lib/utils";

const Stepper = ({ currentStep, steps }: { currentStep: number, steps: string[] }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white",
                currentStep > index + 1 ? "bg-green-500" :
                currentStep === index + 1 ? "bg-primary" :
                "bg-gray-300"
              )}
            >
              {currentStep > index + 1 ? "✓" : index + 1}
            </div>
            <p className={cn(
              "text-sm mt-2 text-center",
              currentStep >= index + 1 ? "font-semibold" : "text-muted-foreground"
            )}>{step}</p>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "flex-auto border-t-2 mx-4",
              currentStep > index + 1 ? "border-green-500" : "border-gray-300"
            )}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
