
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

interface EmailConfirmationProps {
  onBackToLogin: () => void;
  onClose: () => void;
}

export function EmailConfirmation({ onBackToLogin, onClose }: EmailConfirmationProps) {
  return (
    <div className="space-y-4">
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Account created successfully!</strong><br />
          Please check your email and click the confirmation link before logging in. 
          Once confirmed, you can close this dialog and use the login tab.
        </AlertDescription>
      </Alert>
      <div className="flex space-x-2">
        <Button 
          onClick={onBackToLogin} 
          className="flex-1"
          variant="outline"
        >
          Back to Login
        </Button>
        <Button 
          onClick={onClose} 
          className="flex-1"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
