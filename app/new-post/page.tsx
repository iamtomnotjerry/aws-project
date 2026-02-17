"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Loader2, X, Sparkles, Zap, Edit3, Send } from "lucide-react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useS3Upload } from "@/hooks/use-upload";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { SpotlightCard } from "@/features/core/components/SpotlightCard";

const schema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content: z.string().min(1, "Nội dung bài viết không được để trống"),
});

type PostInput = z.infer<typeof schema>;

export default function NewPost() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { upload, uploading } = useS3Upload();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PostInput>({
    resolver: zodResolver(schema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      toast.info("Đã chọn ảnh bìa");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  const onSubmit: SubmitHandler<PostInput> = async (data) => {
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = (await upload(imageFile)) ?? "";
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          image: imageUrl || null,
        }),
      });

      if (!res.ok) throw new Error("Thất bại khi tạo bài viết");

      toast.success("Bài viết đã được xuất bản thành công!");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Không thể xuất bản bài viết. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[250px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px] -z-10 pointer-events-none" />

      {/* Navbar - Floating Glass Layer */}
      <nav className="w-full max-w-4xl px-8 py-6 flex items-center justify-between sticky top-0 z-50 bg-background/50 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="flex items-center gap-6">
          <Magnetic strength={0.2}>
            <Link 
              href="/" 
              className="w-10 h-10 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-500"
            >
              <ArrowLeft size={18} />
            </Link>
          </Magnetic>
          <div className="hidden md:flex flex-col">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">TRẠM SÁNG TẠO</span>
            <span className="text-xs font-bold text-slate-400 italic">Bản thảo chưa lưu</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button 
            type="button" 
            className="text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em] px-4 py-2"
           >
             Lưu nháp
           </button>
           <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting || uploading}
            size="sm"
            className="h-10 px-6 rounded-xl font-black italic tracking-tightest group"
            glow
           >
             {(isSubmitting || uploading) ? <Loader2 className="animate-spin" size={16} /> : (
               <span className="flex items-center gap-2">XUẤT BẢN <Send size={14} className="group-hover:translate-x-1 transition-transform" /></span>
             )}
           </Button>
        </div>
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl px-8 pt-16 pb-32 relative z-10"
      >
        {/* Editorial Header */}
        <div className="mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/[0.03] border border-white/[0.08] text-primary text-[9px] font-black uppercase tracking-[0.2em]">
            <Edit3 size={10} /> Chế độ tập trung
          </div>
          <h1 className="text-6xl font-black tracking-tightest leading-none italic uppercase mb-4">
            VIẾT <span className="text-gradient not-italic">LỊCH SỬ.</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Chia sẻ những mảnh ghép tri thức của bạn với thế giới.</p>
        </div>

        {/* Cover Image Upload Area */}
        <div className="group relative mb-12">
           <AnimatePresence mode="wait">
             {!preview ? (
               <motion.div 
                 key="upload"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="h-40 md:h-64 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-500 flex items-center justify-center overflow-hidden"
               >
                  <input 
                    type="file" 
                    id="cover-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label 
                    htmlFor="cover-upload" 
                    className="flex flex-col items-center gap-4 text-slate-500 cursor-pointer hover:text-white transition-all group/label"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center group-hover/label:bg-primary group-hover/label:text-white transition-all duration-500 shadow-xl">
                      <ImageIcon size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Tải lên ảnh bìa nghệ thuật</span>
                  </label>
               </motion.div>
             ) : (
               <motion.div 
                 key="preview"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="relative w-full h-64 md:h-[450px] rounded-3xl overflow-hidden border border-white/10 group shadow-2xl shadow-primary/10"
               >
                 <Image src={preview} alt="Cover" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                   <button 
                      onClick={removeImage}
                      className="bg-white/10 hover:bg-red-500 text-white p-4 rounded-2xl backdrop-blur-md transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl"
                    >
                      <X size={16} /> Gỡ bỏ ảnh này
                    </button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Editor Form */}
        <div className="space-y-12">
          {/* Title Input */}
          <div className="relative group">
            <div className="absolute -left-8 top-2 hidden md:block opacity-20 group-focus-within:opacity-100 transition-opacity text-primary">
              <Zap size={24} fill="currentColor" />
            </div>
            <textarea
              {...register("title")}
              placeholder="TIÊU ĐỀ BÀI VIẾT (VÍ DỤ: TƯƠNG LAI CỦA AI...)"
              className="w-full bg-transparent text-5xl md:text-7xl font-black italic uppercase tracking-tightest placeholder:text-slate-800 resize-none overflow-hidden outline-none border-none focus:ring-0 p-0 leading-[0.9] transition-all"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            {errors.title && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-4 ml-1">{errors.title.message}</p>}
          </div>

          {/* Separator */}
          <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent" />

          {/* Content Input */}
          <div className="relative group">
             <div className="absolute -left-8 top-1 hidden md:block opacity-20 group-focus-within:opacity-100 transition-opacity text-slate-600">
              <div className="w-1 h-20 bg-white/5 rounded-full" />
            </div>
            <textarea
              {...register("content")}
              placeholder="Hãy bắt đầu câu chuyện của bạn tại đây..."
              className="w-full bg-transparent text-xl text-slate-400 placeholder:text-slate-800 resize-none outline-none border-none focus:ring-0 p-0 focus:text-foreground min-h-[50vh] leading-relaxed italic font-medium"
            />
            {errors.content && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-4">{errors.content.message}</p>}
          </div>
        </div>
      </motion.div>
      
      {/* Footer System Indicator */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end opacity-20 pointer-events-none z-0">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={12} className="text-primary" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">INFINITY EDITOR v2.0</span>
        </div>
        <span className="text-[8px] font-medium text-slate-800">ENCRYPTED EDITORIAL CHANNEL</span>
      </div>
    </div>
  );
}
