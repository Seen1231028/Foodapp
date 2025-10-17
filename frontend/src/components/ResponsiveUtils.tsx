import { cn } from "@/lib/utils"

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={cn("p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6", className)}>
      {children}
    </div>
  )
}

interface ResponsiveHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function ResponsiveHeader({ title, description, action, className }: ResponsiveHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4", className)}>
      <div className="w-full sm:w-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{title}</h1>
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: string
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  cols = { default: 1, md: 2, lg: 4 },
  gap = "4",
  className 
}: ResponsiveGridProps) {
  const gridCols = [
    cols.default ? `grid-cols-${cols.default}` : '',
    cols.sm ? `sm:grid-cols-${cols.sm}` : '',
    cols.md ? `md:grid-cols-${cols.md}` : '',
    cols.lg ? `lg:grid-cols-${cols.lg}` : '',
    cols.xl ? `xl:grid-cols-${cols.xl}` : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cn(`grid gap-${gap}`, gridCols, className)}>
      {children}
    </div>
  )
}

interface ResponsiveTableWrapperProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveTableWrapper({ children, className }: ResponsiveTableWrapperProps) {
  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  )
}

interface ResponsiveCardListProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveCardList({ children, className }: ResponsiveCardListProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:gap-4", className)}>
      {children}
    </div>
  )
}

interface ResponsiveActionsProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveActions({ children, className }: ResponsiveActionsProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto", className)}>
      {children}
    </div>
  )
}

interface ResponsiveSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function ResponsiveSearchBar({ 
  value, 
  onChange, 
  placeholder = "ค้นหา...",
  className 
}: ResponsiveSearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <svg 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}
