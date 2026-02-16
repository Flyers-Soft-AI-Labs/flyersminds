import * as React from "react"

const TabsContext = React.createContext({})

export const Tabs = ({ defaultValue, value, onValueChange, className = "", children }) => {
  const [selectedTab, setSelectedTab] = React.useState(defaultValue || value)

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value)
    }
  }, [value])

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export const TabsList = ({ className = "", children }) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 ${className}`}
    >
      {children}
    </div>
  )
}

export const TabsTrigger = ({ value, className = "", children }) => {
  const { selectedTab, setSelectedTab } = React.useContext(TabsContext)
  const isSelected = selectedTab === value

  return (
    <button
      type="button"
      onClick={() => setSelectedTab(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isSelected
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-600 hover:text-slate-900"
      } ${className}`}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, className = "", children }) => {
  const { selectedTab } = React.useContext(TabsContext)

  if (selectedTab !== value) {
    return null
  }

  return (
    <div
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  )
}

export default Tabs