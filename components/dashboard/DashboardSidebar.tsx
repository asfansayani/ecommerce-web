"use client";

import { Heart, MapPin, Settings, ShoppingBag, Store, UserRound } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  {
    href: "/profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    href: "/address",
    label: "Addresses",
    icon: MapPin,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
] as const;

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex flex-col gap-0.5 px-2 py-1.5 group-data-[collapsible=icon]:hidden">
          <Link href="/">
            <p className="text-[10px] uppercase tracking-[3px] text-[#A37C43]">
              Bijou Sky
            </p>
            <p className="font-boska-medium text-lg text-sidebar-foreground">
              Dashboard
            </p>
          </Link>
        </div>
        <div className="hidden px-1 py-1 group-data-[collapsible=icon]:block">
          <p className="text-center text-xs font-semibold text-[#A37C43]">BS</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} onClick={handleNavigate} />}
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" onClick={handleNavigate} />}
              tooltip="Back to store"
            >
              <Store />
              <span>Back to store</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
