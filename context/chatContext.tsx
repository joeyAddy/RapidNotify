import React, { createContext, useState, useContext, ReactNode } from "react";

interface AppContextType {
  channel: any;
  setChannel: (channel: any) => void;
  thread: any;
  setThread: (thread: any) => void;
}

const defaultValue: AppContextType = {
  channel: null,
  setChannel: (channel) => {},
  thread: null,
  setThread: (thread) => {},
};

export const AppContext = createContext<AppContextType>(defaultValue);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [channel, setChannel] = useState<any>();
  const [thread, setThread] = useState<any>();

  return (
    <AppContext.Provider value={{ channel, setChannel, thread, setThread }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => useContext(AppContext);
