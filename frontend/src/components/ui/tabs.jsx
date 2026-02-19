import * as React from 'react';

const TabsContext = React.createContext({});

export const Tabs = ({ defaultValue, value, onValueChange, className = '', children }) => {
  const [selectedTab, setSelectedTab] = React.useState(defaultValue || value);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className = '', children }) => {
  return (
    <div
      className={`inline-flex h-11 items-center justify-center rounded-2xl border border-[#ccd8cf] bg-[#eef4ef]/90 p-1.5 text-[#4e6168] ${className}`}
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, className = '', children }) => {
  const { selectedTab, setSelectedTab } = React.useContext(TabsContext);
  const isSelected = selectedTab === value;

  return (
    <button
      type="button"
      onClick={() => setSelectedTab(value)}
      data-state={isSelected ? 'active' : 'inactive'}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isSelected
          ? 'bg-white text-[#112026] shadow-[0_10px_24px_-20px_rgba(17,24,39,0.9)]'
          : 'text-[#51646b] hover:bg-white/60 hover:text-[#1d3136]'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, className = '', children }) => {
  const { selectedTab } = React.useContext(TabsContext);

  if (selectedTab !== value) {
    return null;
  }

  return (
    <div
      className={`mt-3 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/30 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  );
};

export default Tabs;
