
import { MoonIcon, SunIcon, UserIcon, BellIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Header = () => {
  const [activeTab, setActiveTab] = useState("analysis");
  
  return (
    <header className="sticky top-0 z-50">
      {/* Top banner for user controls */}
      <div className="bg-white px-6 py-2 flex items-center justify-end border-b text-sm">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-sc-neutral-600">
            <SearchIcon className="h-4 w-4 mr-1" />
            Search
          </Button>
          <Button variant="ghost" size="icon" className="text-sc-neutral-600 relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-sc-red text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">3</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-sc-neutral-600">
            <UserIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-sc-neutral-600">
            <SunIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {/* Main navigation */}
      <div className="px-6 h-16 flex items-center border-b bg-sc-blue text-white shadow-md">
        <div className="flex items-center gap-3 font-semibold text-lg">
          <span className="bg-white text-sc-blue p-1.5 rounded text-sm font-bold">SC</span>
          <span className="font-light tracking-wide">WealthImpact Analyzer</span>
        </div>
        <nav className="ml-auto flex gap-1 sm:gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-white hover:bg-sc-blue-600 border-b-2 ${activeTab === "portfolio" ? "border-white" : "border-transparent"}`}
            onClick={() => setActiveTab("portfolio")}
          >
            Portfolio
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-white hover:bg-sc-blue-600 border-b-2 ${activeTab === "scenarios" ? "border-white" : "border-transparent"}`}
            onClick={() => setActiveTab("scenarios")}
          >
            Scenarios
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-white hover:bg-sc-blue-600 border-b-2 ${activeTab === "analysis" ? "border-white" : "border-transparent"}`}
            onClick={() => setActiveTab("analysis")}
          >
            Analysis
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-white hover:bg-sc-blue-600 border-b-2 ${activeTab === "reports" ? "border-white" : "border-transparent"}`}
            onClick={() => setActiveTab("reports")}
          >
            Reports
          </Button>
        </nav>
      </div>
    </header>
  );
};
