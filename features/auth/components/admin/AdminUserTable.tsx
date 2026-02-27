"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/services/api.service";
import { 
  User, 
  Shield, 
  ShieldAlert, 
  Trash2, 
  Mail, 
  FileText, 
  MessageSquare,
  MoreVertical 
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const AdminUserTable = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await ApiService.admin.getUsers(50);
      return res.data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, version }: { id: string, version: number }) => 
      ApiService.admin.toggleUserRole(id, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated");
    },
    onError: (err: any) => {
      if (err.message.includes("409")) {
        toast.error("Conflict: Updated by another admin");
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ApiService.admin.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("User deleted forever");
    },
  });

  if (isLoading) {
    return <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-20 bg-white/[0.02] rounded-xl border border-white/[0.05]" />
      ))}
    </div>;
  }

  return (
    <div className="relative overflow-x-auto rounded-[2rem] border border-white/[0.05] bg-slate-950/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/[0.01] border-b border-white/[0.05]">
          <tr>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Role</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Activity</th>
            <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {data?.users?.map((user: any) => (
            <motion.tr 
              layout
              key={user.id} 
              className="hover:bg-white/[0.02] transition-colors group"
            >
              <td className="p-8">
                <div className="flex items-center gap-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0">
                    {user.image ? (
                      <Image src={user.image} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-800">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-black italic group-hover:text-primary transition-colors line-clamp-1">{user.name || "Anonymous Soul"}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <Mail size={10} className="text-slate-600" />
                       <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{user.email}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-8">
                <button
                  onClick={() => {
                    if(window.confirm(`Sovereignty change: ${user.role === 'ADMIN' ? 'Demote to User?' : 'Promote to Admin?'}`)) {
                       roleMutation.mutate({ id: user.id, version: user.version });
                    }
                  }}
                  disabled={roleMutation.isPending}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                    user.role === "ADMIN" 
                      ? "bg-primary/10 border-primary/20 text-primary shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                      : "bg-slate-500/10 border-white/5 text-slate-400"
                  }`}
                >
                  {user.role === "ADMIN" ? <Shield size={10} /> : <User size={10} />}
                  {user.role}
                </button>
              </td>
              <td className="p-8">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-600 font-black tracking-widest uppercase">Missions</span>
                    <div className="flex items-center gap-1.5 mt-1">
                       <FileText size={12} className="text-slate-700" />
                       <span className="text-xs font-bold">{user._count.posts}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-600 font-black tracking-widest uppercase">Comments</span>
                    <div className="flex items-center gap-1.5 mt-1">
                       <MessageSquare size={12} className="text-slate-700" />
                       <span className="text-xs font-bold">{user._count.comments}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-8">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    onClick={() => {
                      if(window.confirm("Banish this soul from the platform?")) {
                        deleteMutation.mutate(user.id);
                      }
                    }}
                    className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      
      {data?.users?.length === 0 && (
        <div className="p-32 text-center">
          <p className="text-slate-600 font-black italic uppercase tracking-widest text-sm">The world is empty. No souls connected.</p>
        </div>
      )}
    </div>
  );
};
