import React, { createContext, useContext, useState } from "react";
import { FreightConfig } from "@/types/freight";

interface ConfigContextType {
  configs: FreightConfig[];
  addConfig: (config: FreightConfig) => void;
  updateConfig: (config: FreightConfig) => void;
  getActiveConfig: (client: string, branch: string, transporter: string) => FreightConfig | undefined;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Mock initial data
const initialConfigs: FreightConfig[] = [
  {
    id: "1",
    client: "DHL Express",
    branch: "Mumbai Central",
    transporter: "VRL Logistics",
    primaryMatchKey: "LR Number",
    fallbackKeys: ["Trip ID", "Invoice Number"],
    allowPartialMatch: true,
    autoApprove: true,
    requireManualReview: false,
    allowedSenderDomains: "@dhl.com, @vrl.in",
    acceptedSenderEmails: "transport@dhl.com"
  },
  {
    id: "2",
    client: "Blue Dart",
    branch: "Delhi NCR",
    transporter: "Rivigo",
    primaryMatchKey: "Invoice Number",
    fallbackKeys: ["LR Number"],
    allowPartialMatch: false,
    autoApprove: false,
    requireManualReview: true,
  }
];

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [configs, setConfigs] = useState<FreightConfig[]>(initialConfigs);

  const addConfig = (config: FreightConfig) => {
    setConfigs([...configs, config]);
  };

  const updateConfig = (updatedConfig: FreightConfig) => {
    setConfigs(configs.map(c => c.id === updatedConfig.id ? updatedConfig : c));
  };

  const getActiveConfig = (client: string, branch: string, transporter: string) => {
    return configs.find(
      c => c.client === client && c.branch === branch && c.transporter === transporter
    );
  };

  return (
    <ConfigContext.Provider value={{ configs, addConfig, updateConfig, getActiveConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
};
