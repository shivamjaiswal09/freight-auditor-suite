import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { ConfigProvider } from "@/contexts/ConfigContext";
import { ConfigPage } from "./ConfigPage";
import { AuditPage } from "./AuditPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("audit");

  return (
    <ConfigProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main>
          {activeTab === "audit" ? <AuditPage /> : <ConfigPage />}
        </main>
      </div>
    </ConfigProvider>
  );
};

export default Index;
