"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { fetcher } from "@/lib/fetcher";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().nullable().optional(),
});

type PostInput = z.infer<typeof postSchema>;

const DRAFT_KEY = "infinity_editor_draft";

export default function NewPost() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const previewRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { upload, uploading } = useS3Upload();
  const router = useRouter();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "", coverImage: null }
  });

  const formValues = watch();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setValue("title", parsed.title);
        if (parsed.content) setValue("content", parsed.content);
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [setValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (formValues.title || formValues.content) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title: formValues.title, content: formValues.content }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [formValues.title, formValues.content]);

  const cleanupPreview = useCallback(() => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanupPreview;
  }, [cleanupPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      cleanupPreview();
      const url = URL.createObjectURL(file);
      previewRef.current = url;
      setImageFile(file);
      setPreviewUrl(url);
      toast.info("Cover image selected");
    }
  };

  const removeImage = () => {
    cleanupPreview();
    setImageFile(null);
    setPreviewUrl(null);
    setValue("coverImage", null);
  };

  const onSubmit: SubmitHandler<PostInput> = async (data) => {
    if (isSubmittingForm || uploading) return;
    setIsSubmittingForm(true);
    
    try {
      let coverImageUrl = "";
      if (imageFile) {
        const uploadedUrl = await upload(imageFile);
        if (!uploadedUrl) throw new Error("Image upload failed");
        coverImageUrl = uploadedUrl;
      }

      await fetcher(`/api/posts`, {
        method: "POST",
        headers: { "X-Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({ ...data, coverImage: coverImageUrl || null }),
        timeoutMs: 15000,
      });

      localStorage.removeItem(DRAFT_KEY);
      toast.success("Post published successfully!");
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to publish post");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 -right-20 md:right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/5 rounded-full blur-[100px] md:blur-[250px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 -left-20 md:left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/5 rounded-full blur-[80px] md:blur-[200px] -z-10 pointer-events-none" />

      <nav className="w-full max-w-4xl px-4 md:px-8 py-4 md:py-6 flex items-center justify-between sticky top-0 z-50 bg-background/50 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="flex items-center gap-4 md:gap-6">
          <Magnetic strength={0.2}>
            <Link href="/" className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-500">
              <ArrowLeft size={18} />
            </Link>
          </Magnetic>
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.3em]">SÁNG TẠO</span>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 italic">Bản thảo</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
           <button type="button" className="hidden sm:block text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em] px-4 py-2">Lưu nháp</button>
           <Button onClick={handleSubmit(onSubmit)} disabled={isSubmittingForm || uploading} size="sm" className="h-9 md:h-10 px-4 md:px-6 rounded-xl font-black italic tracking-tightest group" glow>
             {(isSubmittingForm || uploading) ? <Loader2 className="animate-spin" size={16} /> : (
               <span className="flex items-center gap-2 text-[10px] md:text-xs">XUẤT BẢN <Send size={14} className="group-hover:translate-x-1 transition-transform" /></span>
             )}
           </Button>
        </div>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-4xl px-8 pt-16 pb-32 relative z-10">
        <div className="mb-12 md:mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 md:mb-6 rounded-full bg-white/[0.03] border border-white/[0.08] text-primary text-[9px] font-black uppercase tracking-[0.2em]">
            <Edit3 size={10} /> Chế độ tập trung
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tightest leading-none italic uppercase mb-4">VIẾT <span className="text-gradient not-italic">LỊCH SỬ.</span></h1>
          <p className="text-slate-500 text-sm md:text-base font-medium italic px-4 md:px-0">Chia sẻ những mảnh ghép tri thức của bạn với thế giới.</p>
        </div>

        <div className="group relative mb-12">
           <AnimatePresence mode="wait">
             {!previewUrl ? (
               <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-40 md:h-64 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-500 flex items-center justify-center overflow-hidden">
                  <input type="file" id="cover-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <label htmlFor="cover-upload" className="flex flex-col items-center gap-4 text-slate-500 cursor-pointer hover:text-white transition-all group/label">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center group-hover/label:bg-primary group-hover/label:text-white transition-all duration-500 shadow-xl"><ImageIcon size={28} /></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Tải lên ảnh bìa nghệ thuật</span>
                  </label>
               </motion.div>
             ) : (
               <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full h-64 md:h-[450px] rounded-3xl overflow-hidden border border-white/10 group shadow-2xl shadow-primary/10">
                 <Image src={previewUrl} alt="Cover" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                   <button onClick={removeImage} className="bg-white/10 hover:bg-red-500 text-white p-4 rounded-2xl backdrop-blur-md transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl">
                      <X size={16} /> Gỡ bỏ ảnh này
                    </button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="space-y-12">
          <div className="relative group">
            <div className="absolute -left-8 top-2 hidden md:block opacity-20 group-focus-within:opacity-100 transition-opacity text-primary"><Zap size={24} fill="currentColor" /></div>
            <textarea
              {...register("title")}
              placeholder="TIÊU ĐỀ BÀI VIẾT..."
              className="w-full bg-transparent text-4xl md:text-7xl font-black italic uppercase tracking-tightest placeholder:text-slate-800 resize-none overflow-hidden outline-none border-none focus:ring-0 p-0 leading-[1.1] md:leading-[0.9] transition-all"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            {errors.title && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-4 ml-1">{errors.title.message}</p>}
          </div>

          <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent" />

          <div className="relative group">
             <div className="absolute -left-8 top-1 hidden md:block opacity-20 group-focus-within:opacity-100 transition-opacity text-slate-600"><div className="w-1 h-20 bg-white/5 rounded-full" /></div>
            <textarea
              {...register("content")}
              placeholder="Hãy bắt đầu câu chuyện của bạn tại đây..."
              className="w-full bg-transparent text-xl text-slate-400 placeholder:text-slate-800 resize-none outline-none border-none focus:ring-0 p-0 focus:text-foreground min-h-[50vh] leading-relaxed italic font-medium"
            />
            {errors.content && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-4">{errors.content.message}</p>}
          </div>
        </div>
      </motion.div>
      
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
