import { AdminPostTable } from "@/features/blog/components/admin/AdminPostTable";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminPostsPage() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extra-bold tracking-tightest leading-none mb-2 italic uppercase">MISSIONS</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Content Lifecycle Management</p>
        </div>
        <Link href="/new-post">
           <button className="px-8 h-14 bg-white/[0.02] border border-white/10 hover:border-primary/50 text-white rounded-2xl font-black italic uppercase tracking-widest text-xs transition-all flex items-center gap-3">
            <Plus size={20} className="text-primary" /> Create New
          </button>
        </Link>
      </div>

      <AdminPostTable />
    </div>
  );
}
