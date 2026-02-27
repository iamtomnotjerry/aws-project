import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, Settings, LogOut, ChevronRight, User } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", href: "/admin" },
    { icon: <FileText size={20} />, label: "Posts", href: "/admin/posts" },
    { icon: <User size={20} />, label: "Users", href: "/admin/users" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Dynamic Glass Sidebar */}
      <aside className="w-72 border-r border-white/[0.05] bg-slate-950/50 backdrop-blur-2xl flex flex-col sticky top-0 h-screen z-50">
        <div className="p-8 border-b border-white/[0.05]">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
              B
            </div>
            <span className="text-xl font-black tracking-tightest leading-none italic uppercase">
              Admin<span className="text-primary not-italic">.CMS</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all group"
            >
              <div className="flex items-center gap-4 opacity-60 group-hover:opacity-100 transition-opacity">
                {item.icon}
                <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
          ))}
        </nav>

        <div className="p-8 mt-auto border-t border-white/[0.05] space-y-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-primary font-black italic">
              {session.user.name?.[0] || "A"}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Connected</p>
              <p className="text-xs font-bold leading-none">{session.user.name}</p>
            </div>
          </div>
          
          <Link href="/" className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
            <LogOut size={14} /> Back to Blog
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Animated Background Blob */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
        
        <header className="h-24 border-b border-white/[0.05] flex items-center justify-between px-12 backdrop-blur-md sticky top-0 z-40 bg-slate-950/20">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
            System / Management / <span className="text-white">Active session</span>
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Live Status</span>
          </div>
        </header>

        <div className="p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
