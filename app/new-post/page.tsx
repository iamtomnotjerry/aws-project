"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostInput } from "@/schemas/post.schema";
import { useS3Upload } from "@/hooks/use-upload";
import { ApiService } from "@/services/api.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";

export default function NewPost() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { upload, uploading } = useS3Upload();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      published: true,
      coverImage: undefined
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<PostInput> = async (data) => {
    try {
      let coverImage = null;
      if (imageFile) {
        coverImage = await upload(imageFile);
      }

      const res = await ApiService.posts.create({ ...data, coverImage });
      if (res.success) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-2xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-8 md:p-12">
          <header className="mb-10">
            <h1 className="text-4xl font-bold mb-3">Create Post</h1>
            <p className="text-gray-400">Share your cloud knowledge with the world.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Input 
              label="Article Title" 
              placeholder="e.g. Master Next.js for Production"
              error={errors.title?.message}
              {...register("title")}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Cover Image</label>
              {preview ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden group border border-white/10">
                  <Image src={preview} alt="Upload Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="danger" size="sm" onClick={() => { setPreview(null); setImageFile(null); }}>
                      <X size={18} /> Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center gap-3 text-gray-500 group-hover:text-blue-400 transition-colors">
                    <ImageIcon size={48} strokeWidth={1.5} />
                    <span className="font-medium">Upload high-quality cover</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <Textarea 
              label="Content" 
              placeholder="Start writing your story..."
              error={errors.content?.message}
              {...register("content")}
            />

            <Button 
              type="submit" 
              className="w-full" 
              loading={isSubmitting || uploading}
              glow
            >
              {uploading ? "Uploading Image..." : "Publish Article"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
