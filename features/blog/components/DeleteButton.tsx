"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiService } from "@/services/api.service";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) return;
    
    setLoading(true);
    try {
      const res = await ApiService.posts.delete(id);
      if (res.success) {
        toast.success("Đã xóa bài viết thành công");
        router.push("/");
        router.refresh();
      } else {
        toast.error(res.error || "Không thể xóa bài viết");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="danger" 
      size="md" 
      onClick={handleDelete}
      loading={loading}
      className="px-10 h-14 rounded-2xl"
    >
      <Trash2 size={18} /> Xóa bài viết
    </Button>
  );
}
