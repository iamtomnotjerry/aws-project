"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Loader2, X, Sparkles, Zap, Edit3, Send, CheckCircle2, AlertCircle } from "lucide-react";
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "", coverImage: null }
  });

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
    let timeoutId: NodeJS.Timeout;
    const subscription = watch((value, { type }) => {
      if (type === 'change') {
        setSaveStatus("saving");
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const vals = getValues();
          if (vals.title || vals.content) {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({ title: vals.title, content: vals.content }));
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 3000); 
          }
        }, 1500); 
      }
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [watch, getValues]);

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
    setSubmitError(null);
    
    try {
      let coverImageUrl = "";
      if (imageFile) {
        const uploadedUrl = await upload(imageFile);
        if (!uploadedUrl) throw new Error("Image upload failed. Please try again or remove the image.");
        coverImageUrl = uploadedUrl;
      }

      await fetcher(`/api/posts`, {
        method: "POST",
        headers: { "X-Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({ ...data, coverImage: coverImageUrl || null }),
        timeoutMs: 15000,
      });

      localStorage.removeItem(DRAFT_KEY);
      router.push("/");
      router.refresh();
      setTimeout(() => toast.success("Post published successfully!"), 100);
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : "Failed to publish post");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 -right-20 md:right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/5 rounded-full blur-[100px] md:blur-[250px] -z-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 -left-20 md:left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/5 rounded-full blur-[80px] md:blur-[200px] -z-10 pointer-events-none" aria-hidden="true" />

      <nav className="w-full max-w-4xl px-4 md:px-8 py-4 md:py-6 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="flex items-center gap-4 md:gap-6">
          <Magnetic strength={0.2}>
            <Link 
              href="/" 
              aria-label="Back to home"
              className="min-w-[44px] min-h-[44px] rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-500 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <ArrowLeft size={20} />
            </Link>
          </Magnetic>
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em]">SÁNG TẠO</span>
            <span className="text-[11px] md:text-sm font-bold text-slate-300 italic">Bản thảo</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <AnimatePresence mode="wait">
             {saveStatus === "saving" && (
               <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-slate-400 italic">
                 <Loader2 size={12} className="animate-spin" /> Saving...
               </motion.span>
             )}
             {saveStatus === "saved" && (
               <motion.span key="saved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 italic">
                 <CheckCircle2 size={12} /> Saved as Draft
               </motion.span>
             )}
           </AnimatePresence>

           <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmittingForm || uploading} 
            size="sm" 
            className="min-w-[120px] min-h-[44px] px-6 rounded-xl font-black italic tracking-tightest group focus:ring-2 focus:ring-primary focus:outline-none focus:ring-offset-2 focus:ring-offset-background" 
            glow
           >
             {(isSubmittingForm || uploading) ? <Loader2 className="animate-spin" size={20} /> : (
               <span className="flex items-center gap-2 text-xs md:text-sm">XUẤT BẢN <Send size={16} className="group-hover:translate-x-1 transition-transform" /></span>
             )}
           </Button>
        </div>
      </nav>

      <motion.form 
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="w-full max-w-4xl px-4 md:px-8 pt-10 pb-32 relative z-10"
      >
        
        {submitError && (
          <div role="alert" className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <span className="font-medium text-sm">{submitError}</span>
            </div>
            <Button type="button" onClick={handleSubmit(onSubmit)} variant="secondary" className="min-w-[44px] min-h-[44px] px-4 rounded-xl text-xs font-bold text-white bg-red-500/20 hover:bg-red-500/30">
              Thử lại
            </Button>
          </div>
        )}

        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/[0.03] border border-white/[0.08] text-primary text-[10px] font-black uppercase tracking-[0.2em]" aria-hidden="true">
            <Edit3 size={12} /> Chế độ tập trung
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tightest leading-none italic uppercase mb-4">VIẾT <span className="text-gradient not-italic">LỊCH SỬ.</span></h1>
        </div>

        <div className="group relative mb-12">
           <AnimatePresence mode="wait">
             {!previewUrl ? (
               <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-48 md:h-64 rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/40 transition-all duration-300 flex items-center justify-center overflow-hidden focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
                  <input type="file" id="cover-upload" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10" accept="image/*" onChange={handleFileChange} aria-label="Upload cover image" />
                  <div className="flex flex-col items-center gap-4 text-slate-400 transition-all group-hover:text-white pointer-events-none">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.05] flex items-center justify-center text-slate-300 shadow-xl transition-all"><ImageIcon size={28} /></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Tải lên ảnh bìa nghệ thuật</span>
                  </div>
               </motion.div>
             ) : (
               <motion.div key="preview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full h-64 md:h-[450px] rounded-3xl overflow-hidden border border-white/10 group shadow-2xl shadow-primary/10">
                 <Image src={previewUrl} alt="Cover preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                   <button type="button" onClick={removeImage} aria-label="Remove cover image" className="min-w-[44px] min-h-[44px] px-6 bg-black/50 hover:bg-red-500 text-white rounded-2xl backdrop-blur-md transition-all flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest shadow-xl focus:outline-none focus:ring-2 focus:ring-white">
                      <X size={18} /> <span className="hidden sm:inline">Gỡ bỏ ảnh này</span>
                    </button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <fieldset className="space-y-12">
          <legend className="sr-only">Post Content</legend>
          <div className="relative group">
            <div className="absolute -left-10 top-2 hidden lg:block opacity-0 group-focus-within:opacity-100 transition-opacity text-primary" aria-hidden="true"><Zap size={24} fill="currentColor" /></div>
            <label htmlFor="post-title" className="sr-only">Title</label>
            <textarea
              id="post-title"
              {...register("title")}
              placeholder="TIÊU ĐỀ BÀI VIẾT..."
              className={`w-full bg-transparent text-3xl md:text-5xl lg:text-7xl font-black italic uppercase tracking-tightest placeholder:text-slate-600 resize-none overflow-hidden outline-none border-none focus:ring-0 p-0 leading-[1.2] md:leading-[1.1] transition-all text-white ${errors.title ? 'placeholder:text-red-500/50' : ''}`}
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            {errors.title && <p role="alert" className="text-red-400 text-xs font-bold uppercase tracking-widest mt-4 ml-1 flex items-center gap-1.5"><AlertCircle size={14} /> {errors.title.message}</p>}
          </div>

          <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent opacity-50" aria-hidden="true" />

          <div className="relative group">
             <div className="absolute -left-10 top-1 hidden lg:block opacity-0 group-focus-within:opacity-100 transition-opacity text-slate-500" aria-hidden="true"><div className="w-1 h-20 bg-white/10 rounded-full" /></div>
            <label htmlFor="post-content" className="sr-only">Content</label>
            <textarea
              id="post-content"
              {...register("content")}
              placeholder="Hãy bắt đầu câu chuyện của bạn tại đây..."
              className="w-full bg-transparent text-lg md:text-xl text-slate-300 placeholder:text-slate-600 resize-none outline-none border-none focus:ring-0 p-0 min-h-[60vh] leading-relaxed font-medium"
            />
            {errors.content && <p role="alert" className="text-red-400 text-xs font-bold uppercase tracking-widest mt-4 flex items-center gap-1.5"><AlertCircle size={14} /> {errors.content.message}</p>}
          </div>
        </fieldset>
      </motion.form>
      
      <div className="hidden lg:flex fixed bottom-8 right-8 flex-col items-end opacity-30 pointer-events-none z-0" aria-hidden="true">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">INFINITY EDITOR v2.0</span>
        </div>
        <span className="text-[9px] font-medium text-slate-600">ENCRYPTED EDITORIAL CHANNEL</span>
      </div>
    </div>
  );
}
