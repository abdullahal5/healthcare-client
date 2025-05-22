import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  buttonLabel: string;
  onButtonClick: () => void;
  icon?: ReactNode;
};

const PageHeader = ({
  title,
  subtitle,
  buttonLabel,
  onButtonClick,
  icon,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      <Button onClick={onButtonClick} className="gap-2">
        {icon}
        {buttonLabel}
      </Button>
    </div>
  );
};

export default PageHeader;
