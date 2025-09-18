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

const AmazonLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width="100" height="30" fill="currentColor">
        <path d="M26.2,12.7c-0.2-1.8-1.3-3.1-3.2-3.1c-1.8,0-3.1,1.2-3.3,3.1H26.2z M17.1,17.4c0.2,1.8,1.3,3.1,3.2,3.1c1.8,0,3.1-1.2,3.3-3.1H17.1z M30.6,15c0,4.4-3.3,6.2-7.2,6.2c-4.2,0-7.3-2.1-7.3-6.4c0-4.4,3.2-6.3,7.3-6.3C27.3,8.5,30.6,10.3,30.6,15 M32.9,15c0-5.8-4.5-8-9.1-8c-5.1,0-9,2.8-9,7.8c0,5.4,4.2,7.9,9.4,7.9C28.5,22.7,32.9,20.4,32.9,15 M43.4,21.2V9h-3.8v12.2H43.4z M52.9,9h-3.8v11.1c0,1-0.9,1.2-1.7,0.9l-0.8-0.5V9h-3.8v12.2h3.2l0.4,0.2c1,0.6,2.1,1,3.2,0.6c1.1-0.3,1.5-1.2,1.5-2.4V9z M66.4,12.7c-0.2-1.8-1.3-3.1-3.2-3.1c-1.8,0-3.1,1.2-3.3,3.1H66.4z M57.3,17.4c0.2,1.8,1.3,3.1,3.2,3.1c1.8,0,3.1-1.2,3.3-3.1H57.3z M70.8,15c0,4.4-3.3,6.2-7.2,6.2c-4.2,0-7.3-2.1-7.3-6.4c0-4.4,3.2-6.3,7.3-6.3C67.5,8.5,70.8,10.3,70.8,15 M73.1,15c0-5.8-4.5-8-9.1-8c-5.1,0-9,2.8-9,7.8c0,5.4,4.2,7.9,9.4,7.9C68.7,22.7,73.1,20.4,73.1,15 M83,9.8c-0.8-0.8-1.9-1-2.9-0.8l-0.9,0.2V9h-3.8v12.2h3.5l0.3-0.2c0.9-0.5,1.4-1.3,1.4-2.2c0-0.9-0.5-1.7-1.4-2.2l-1.9-1l1.8-0.8c0.8-0.4,1.3-1,1.3-1.8C83.3,10.6,83.2,10.2,83,9.8 M80.4,15.8c0.2,0.1,0.3,0.2,0.3,0.4c0,0.3-0.2,0.6-0.8,0.8l-2.1,0.9v-2.3L80.4,15.8z M80.4,11.8c0.2,0.1,0.3,0.2,0.3,0.4c0,0.3-0.2,0.6-0.8,0.8L77.8,14v-2.3L80.4,11.8z"/>
        <path d="M86.8,17.2c3-1.2,5-3.5,5.7-4.4c0,0,0.1,0.1,0.1,0.1c-0.5,1.1-1.6,3-4,4.4c-0.3,0.1-0.5,0.2-0.8,0.2C87.5,17.5,87.2,17.4,86.8,17.2 M94.3,12c-0.2-0.2-0.4-0.4-0.6-0.6c-0.8,0.8-3.1,3.4-6.5,4.8c-0.6,0.2-1.2,0.2-1.8-0.1c-0.6-0.3-1-0.8-1.2-1.4c-0.2-0.7,0-1.4,0.5-1.9c0.5-0.5,1.1-0.7,1.8-0.5c3.3,0.8,5.4,0.3,6.5-0.5c1.1-0.8,1.2-2,0.5-3.1c-0.8-1.1-2-1.3-3.1-0.5c-1.1,0.8-1.5,2.1-0.4,3.3L88.9,15c-1.6-1.6-1.1-4.2,0.8-5.7c1.9-1.5,4.6-1.1,6,0.8C97.1,11.4,96.5,14,94.3,12"/>
    </svg>
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <AmazonLogo />
                <h2 className="font-headline text-lg font-semibold text-sidebar-foreground">ProductPilot</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Market Intelligence Engine to scout new avenues for Amazon Basics Products</p>
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
