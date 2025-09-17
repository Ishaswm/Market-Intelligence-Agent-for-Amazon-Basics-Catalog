import type { ReactNode } from 'react'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DashboardNav } from '@/components/dashboard-nav'
import { Package } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="size-10 bg-primary text-primary-foreground">
                <Package className="size-5" />
            </Button>
            <div className="flex flex-col">
              <h2 className="font-headline text-lg font-semibold">ProductPilot</h2>
              <p className="text-sm text-muted-foreground">Amazon Basics</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <DashboardNav />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-4">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/avatar/40/40" />
              <AvatarFallback>BD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">BD Manager</span>
              <span className="text-xs text-muted-foreground">
                bd.manager@amazon.com
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                {/* Header content can go here */}
            </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
