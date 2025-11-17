import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-6">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="h-12 bg-transparent border-b-0">
            <TabsTrigger 
              value="audit" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6"
            >
              Freight Audit
            </TabsTrigger>
            <TabsTrigger 
              value="config"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6"
            >
              Config
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
