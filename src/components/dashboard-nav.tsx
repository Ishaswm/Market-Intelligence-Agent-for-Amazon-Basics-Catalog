'use client'

import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  MessageSquareText,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import type { ComponentProps } from 'react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/trends', icon: TrendingUp, label: 'Trend Identification' },
  { href: '/dashboard/sentiment', icon: MessageSquareText, label: 'Sentiment Analysis' },
  { href: '/dashboard/opportunities', icon: FileText, label: 'Reports' },
]

export function DashboardNav(props: ComponentProps<typeof SidebarMenu>) {
  const pathname = usePathname()

  return (
    <SidebarMenu {...props}>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={{ children: item.label }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
