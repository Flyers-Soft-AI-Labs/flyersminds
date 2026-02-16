import * as React from "react"

const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block text-left">{children}</div>
}

const DropdownMenuTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = ({ children, align = "end", className = "", ...props }) => {
  const alignClass = align === "end" ? "right-0" : "left-0"
  return (
    <div
      className={`absolute ${alignClass} mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${className}`}
      {...props}
    >
      <div className="py-1">{children}</div>
    </div>
  )
}

const DropdownMenuItem = ({ children, onClick, className = "", ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`text-gray-700 hover:bg-gray-100 hover:text-gray-900 block w-full text-left px-4 py-2 text-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const DropdownMenuSeparator = ({ className = "" }) => {
  return <div className={`border-t border-gray-200 my-1 ${className}`} />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}