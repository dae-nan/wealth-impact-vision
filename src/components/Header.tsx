
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-sc-blue text-white shadow-md">
      <div className="flex items-center gap-3 font-semibold text-lg">
        <span className="bg-white text-sc-blue p-1.5 rounded text-sm font-bold">SC</span>
        <span className="font-light tracking-wide">WealthImpact Analyzer</span>
      </div>
      <nav className="ml-auto flex gap-1 sm:gap-4">
        <Button variant="ghost" size="sm" className="text-white hover:bg-sc-blue-600">
          Portfolio
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-sc-blue-600">
          Scenarios
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-sc-blue-600">
          Analysis
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-sc-blue-600">
          Reports
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-sc-blue-600">
          <SunIcon className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </nav>
    </header>
  );
};
