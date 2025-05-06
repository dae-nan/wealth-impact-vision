
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <div className="flex items-center gap-2 font-semibold text-lg">
        <span className="bg-primary text-primary-foreground p-1 rounded text-sm">WI</span>
        <span>WealthImpact Analyzer</span>
      </div>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Portfolio
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Scenarios
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Analysis
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Reports
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <SunIcon className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </nav>
    </header>
  );
};
