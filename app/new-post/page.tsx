"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useS3Upload } from "@/hooks/use-upload";
import Image from "next/image";
import { motion } from "framer-motion";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type PostInput = z.infer<typeof schema>;

export default function NewPost() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { upload, uploading } = useS3Upload();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<PostInput>({
    resolver: zodResolver(schema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
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

      if (!res.ok) throw new Error("Failed to create post");

      toast.success("Post published successfully.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to publish post.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Navbar - Floating / Top */}
      <nav className="w-full max-w-3xl px-6 py-6 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="text-subtle hover:text-foreground transition-colors p-2 -ml-2 rounded-lg hover:bg-white/5">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
           <button 
            type="button" 
            className="text-subtle hover:text-foreground transition-colors text-sm font-medium mr-4"
           >
             Save draft
           </button>
           <button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting || uploading}
            className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center gap-2"
           >
             {(isSubmitting || uploading) && <Loader2 className="animate-spin" size={14} />}
             Publish
           </button>
        </div>
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl px-6 pb-24"
      >
        {/* Cover Image Area */}
        <div className="group relative mb-8">
           {!preview ? (
             <div className="h-2 rounded-lg group-hover:h-12 transition-all duration-300 bg-transparent group-hover:bg-[#131418] border border-transparent group-hover:border-[#2E2F33] flex items-center px-4 overflow-hidden">
                <input 
                  type="file" 
                  id="cover-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="cover-upload" 
                  className="flex items-center gap-2 text-subtle text-sm cursor-pointer hover:text-foreground transition-colors w-full h-full opacity-0 group-hover:opacity-100"
                >
                  <ImageIcon size={16} /> Add cover image
                </label>
             </div>
           ) : (
             <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-[#2E2F33] group-hover:border-[#45464F] transition-colors">
               <Image src={preview} alt="Cover" fill className="object-cover" />
               <button 
                  onClick={removeImage}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
             </div>
           )}
        </div>

        {/* Title Input */}
        <textarea
          {...register("title")}
          placeholder="Post Title"
          className="w-full bg-transparent text-4xl md:text-5xl font-bold placeholder:text-[#2E2F33] resize-none overflow-hidden outline-none border-none focus:ring-0 p-0 mb-6 leading-tight"
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
        />

        {/* Content Input */}
        <textarea
          {...register("content")}
          placeholder="Tell your story..."
          className="w-full bg-transparent text-lg text-subtle placeholder:text-[#2E2F33] resize-none outline-none border-none focus:ring-0 p-0 focus:text-foreground min-h-[40vh] leading-relaxed"
        />
          {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content.message}</p>}
      </motion.div>
    </div>
  );
}
