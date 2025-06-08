
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface TourStep {
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to Inventory IQ!",
    description: "Let's take a quick tour to get you started with the platform. This will only take a minute!"
  },
  {
    title: "Dashboard Overview", 
    description: "Your main dashboard shows key metrics, sales data, and inventory status at a glance."
  },
  {
    title: "Navigation Menu",
    description: "Use the sidebar to navigate between different sections: Dashboard, Inventory, Customers, Leads, and Admin tools."
  },
  {
    title: "Admin Features",
    description: "As an admin, you can add data, manage system settings, and access detailed reports and analytics."
  },
  {
    title: "Quick Actions",
    description: "Look for action buttons throughout the interface to add new items, refresh data, and manage your inventory."
  },
  {
    title: "You're All Set!",
    description: "That's it! Start exploring the platform. You can always access help through the user menu."
  }
];

const OnboardingTour = () => {
  const [hasSeenTour, setHasSeenTour] = useLocalStorage('hasSeenOnboardingTour', false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(!hasSeenTour);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setHasSeenTour(true);
    setIsOpen(false);
  };

  const handleSkip = () => {
    setHasSeenTour(true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <span>{currentTourStep.title}</span>
              <Badge variant="outline" className="text-xs">
                {currentStep + 1} of {tourSteps.length}
              </Badge>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {currentTourStep.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext}>
            {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
            {currentStep < tourSteps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTour;
