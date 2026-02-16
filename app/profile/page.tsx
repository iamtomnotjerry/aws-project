"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { 
  User, Mail, Shield, CheckCircle2, ChevronRight, 
  Settings, LogOut, Terminal, Keyboard
} from "lucide-react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface SettingsRowProps {
  icon: LucideIcon;
  label: string;
  value?: React.ReactNode;
  action?: boolean;
  destructive?: boolean;
}

function SettingsRow({ icon: Icon, label, value, action = false, destructive = false }: SettingsRowProps) {
  return (
    <div className={`
      group flex items-center justify-between p-4 bg-[#131418] border-b border-[#2E2F33] 
      last:border-0 hover:bg-[#1C1D22] transition-colors cursor-pointer
      ${destructive ? "hover:bg-red-500/10" : ""}
    `}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-md ${destructive ? "text-red-500" : "text-subtle group-hover:text-foreground transition-colors"}`}>
          <Icon size={16} />
        </div>
        <span className={`text-sm font-medium ${destructive ? "text-red-500" : "text-subtle group-hover:text-foreground transition-colors"}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">{value}</span>
        {action && <ChevronRight size={14} className="text-[#45464F]" />}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="min-h-screen bg-background" />;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-background pt-24 px-6 md:px-0">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold mb-6 px-1">Settings</h1>
        
        {/* Identity Section */}
        <div className="mb-8 p-6 flex flex-col items-center justify-center">
           <div className="w-24 h-24 rounded-full overflow-hidden border border-[#2E2F33] mb-4 relative group">
              <Image 
                src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=131418&color=EEEEF0`} 
                alt="Avatar" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
           </div>
           <h2 className="text-lg font-medium text-foreground">{user.name}</h2>
           <p className="text-subtle text-sm">{user.email}</p>
           {user.role === "ADMIN" && (
             <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#5E6AD2] bg-[#5E6AD2]/10 px-2 py-1 rounded">
               Administrator
             </span>
           )}
        </div>

        {/* General Settings */}
        <div className="mb-6 space-y-2">
          <h3 className="text-[11px] font-medium text-subtle uppercase tracking-wider px-1 mb-2">Account</h3>
          <div className="rounded-xl border border-[#2E2F33] overflow-hidden bg-[#131418]">
            <SettingsRow icon={User} label="Name" value={user.name} action />
            <SettingsRow icon={Mail} label="Email" value={user.email} />
            <SettingsRow icon={Shield} label="User ID" value={<span className="font-mono text-xs text-subtle">{user.id.slice(0, 8)}...</span>} />
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-6 space-y-2">
          <h3 className="text-[11px] font-medium text-subtle uppercase tracking-wider px-1 mb-2">Preferences</h3>
          <div className="rounded-xl border border-[#2E2F33] overflow-hidden bg-[#131418]">
            <SettingsRow icon={Terminal} label="Theme" value="Linear Dark" action />
            <SettingsRow icon={Keyboard} label="Shortcuts" value="Enabled" action />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-2">
          <div className="rounded-xl border border-[#2E2F33] overflow-hidden bg-[#131418]">
            <SettingsRow icon={LogOut} label="Log Out" destructive action />
          </div>
          <p className="text-[11px] text-subtle text-center pt-4">
            Version 1.0.2 (Linear Build)
          </p>
        </div>
      </div>
    </div>
  );
}
