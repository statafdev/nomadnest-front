"use client";

import {
  LayoutDashboard,
  Home,
  PlusCircle,
  Settings,
  LogOut,
  User,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions"; // Ta server action

// Menu items pour le client
const items = [
  {
    title: "Vue d'ensemble",
    url: "/client",
    icon: LayoutDashboard,
  },
  {
    title: "Mes Annonces",
    url: "/client/my-listings",
    icon: Home,
  },
  {
    title: "Ajouter un logement",
    url: "/client/create",
    icon: PlusCircle,
  },
  {
    title: "Mon Profil",
    url: "/client/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            N
          </div>
          <span className="truncate font-semibold">NomadNest</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Bouton de Déconnexion */}
            {/* On peut appeler la server action directement via onClick en Client Component */}
            <SidebarMenuButton
              onClick={() => logout()}
              className="text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <LogOut />
              <span>Se déconnecter</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
