import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border divide-x divide-amber-200 px-4">
            <SidebarTrigger className="-ms-1" />
            
            <p className="text-sm font-medium text-muted-foreground">
              Dashboard
            </p>
          </header>
          <div className="flex-1 overflow-x-hidden">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
