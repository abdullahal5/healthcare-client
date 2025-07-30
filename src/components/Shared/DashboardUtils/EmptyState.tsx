import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
};

const EmptyState = ({
  icon,
  title,
  description,
  buttonLabel,
  onButtonClick,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-white p-12 text-center shadow-sm">
      <div className="max-w-md space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
        {onButtonClick && (
          <Button onClick={onButtonClick} className="mt-4 gap-2">
            {icon}
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
