import { Store, CreditCard, Server, Settings  } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/app/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"

interface MenuItemsProps {
  collapsed: boolean
  currentPath: string
}

export const menuItems = [
  {
    title: "Vendors",
    icon: Store,
    href: "/admin/vendors",
  },
  {
    title: "Plans",
    icon: CreditCard,
    href: "/admin/plans",
  },
  {
    title: "Billing Service",
    icon: Server,
    href: "/admin/billingservices",
  },
  // {
  //   title: "Settings",
  //   icon: Settings,
  //   href: "/admin/settings"
  // }
]

export default function MenuItems({ collapsed, currentPath }: MenuItemsProps) {
  return (
    <div className="space-y-1 px-3">
      {menuItems.map((item) => {
        const isActive = currentPath === item.href
        const MenuItem = (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
              collapsed ? "justify-center" : "justify-start",
              isActive
                ? "bg-accent text-accent-foreground shadow-sm dark:bg-accent/50"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground",
              collapsed ? "mx-0" : "mr-3"
            )} />
            {!collapsed && (
              <span>
                {item.title}
              </span>
            )}
          </Link>
        )

        return collapsed ? (
          <TooltipProvider key={item.href} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                {MenuItem}
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {item.title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : MenuItem
      })}
    </div>
  )
}

