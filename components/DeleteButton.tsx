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
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      const res = await ApiService.posts.delete(id);
      if (res.success) {
        toast.success("Post deleted successfully");
        router.push("/");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete post");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
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
    >
      <Trash2 size={18} /> Delete Article
    </Button>
  );
}
