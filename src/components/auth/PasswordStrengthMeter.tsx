import { Progress } from "@/components/ui/progress";
import { getPasswordStrength } from "@/lib/passwordValidation";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  if (!password) return null;

  const { score, label, color } = getPasswordStrength(password);
  const percentage = (score / 5) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Password strength</span>
        <span className={`font-medium ${score <= 2 ? "text-destructive" : score <= 3 ? "text-yellow-600" : "text-green-600"}`}>
          {label}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
