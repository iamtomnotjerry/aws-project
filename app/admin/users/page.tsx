import { AdminUserTable } from "@/features/auth/components/admin/AdminUserTable";

export default function AdminUsersPage() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extra-bold tracking-tightest leading-none mb-2 italic uppercase">SOULS</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Connected User Base Management</p>
        </div>
      </div>

      <AdminUserTable />
    </div>
  );
}
