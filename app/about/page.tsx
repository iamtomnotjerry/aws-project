"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, MapPin, GraduationCap, Code2, Database, Layers, Dumbbell, Cpu, Heart, User, Zap } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/ui/Magnetic";
import { SpotlightCard } from "@/components/SpotlightCard";

// --- Data Definitions (Human-Centric Content) ---

const BIO_DATA = {
  name: "Nguyễn Đình Bảo",
  year: 2004,
  location: "Đắk Lắk",
  education: "UIT - Khoa Học Máy Tính",
  fullEducation: "Đại học Công nghệ Thông tin (UIT)",
  role: "Software Developer @ f17team",
  mantra: "Học hỏi mỗi ngày để trở thành phiên bản tốt hơn của chính mình.",
};

const GROWTH_CARDS = [
  {
    title: "TẬP GYM.",
    desc: "Đây là cách mình rèn luyện sức khỏe và tính kỷ luật. Sau những giờ code căng thẳng, gym giúp mình nạp lại năng lượng tích cực.",
    icon: <Dumbbell size={32} />,
    color: "emerald",
    glow: "rgba(16, 185, 129, 0.15)",
  },
  {
    title: "HỌC HỎI.",
    desc: "Mình luôn tò mò và yêu thích việc tìm tòi những kiến thức, kỹ năng mới để không bao giờ dứng lại một chỗ.",
    icon: <Sparkles size={32} />,
    color: "violet",
    glow: "rgba(139, 92, 246, 0.15)",
  },
  {
    title: "CÂN BẰNG.",
    desc: "Đối với mình, việc cân bằng giữa công việc, học tập và cuộc sống cá nhân là chìa khóa để duy trì đam mê bền vững.",
    icon: <Heart size={32} />,
    color: "rose",
    glow: "rgba(244, 63, 94, 0.15)",
  },
];

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-48 px-6 relative bg-slate-950 overflow-hidden selection:bg-primary/30">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[250px] -z-10 animate-pulse-slow pointer-events-none" />
      <div className="absolute -bottom-64 -left-64 w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[220px] -z-10 pointer-events-none" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header Navigation */}
        <motion.div variants={itemVariants} className="mb-20">
          <Magnetic strength={0.2}>
            <Link 
              href="/" 
              className="inline-flex items-center gap-4 text-slate-500 hover:text-white transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500 shadow-2xl shadow-primary/20">
                <ArrowLeft size={18} />
              </div>
              <span className="font-black uppercase text-[11px] tracking-[0.4em]">Quay Lại Trang Chủ</span>
            </Link>
          </Magnetic>
        </motion.div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-40 items-start">
          <div className="lg:col-span-8">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-4 mb-10">
                <div className="px-4 py-1.5 rounded-full glass-morphism border-white/[0.08] text-primary text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <User size={12} /> Một chút về mình
                </div>
              </div>
              
              <h1 className="text-[5rem] md:text-[11rem] font-black tracking-tightest leading-[0.85] italic mb-10">
                MÌNH LÀ <br />
                <span className="text-gradient not-italic">NGUYỄN ĐÌNH BẢO.</span>
              </h1>
              
              <div className="flex flex-wrap gap-8 text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em] italic">
                <span className="flex items-center gap-3"><MapPin size={14} className="text-primary" /> {BIO_DATA.location}</span>
                <span className="flex items-center gap-3"><GraduationCap size={14} className="text-violet-400" /> {BIO_DATA.education}</span>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-4 lg:pt-32">
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 to-transparent opacity-20" />
              <p className="text-slate-500 text-2xl font-medium italic leading-[1.6] pl-4">
                "{BIO_DATA.mantra}"
              </p>
            </motion.div>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-40">
          <motion.div variants={itemVariants} className="md:col-span-8">
            <SpotlightCard className="h-full p-12 md:p-20" glowColor="rgba(59, 130, 246, 0.1)">
              <div className="flex flex-col gap-12">
                <div className="flex flex-wrap gap-4">
                  <div className="px-6 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-[10px] font-black uppercase tracking-widest italic hover:bg-white/[0.08] transition-all">
                    Sinh năm 2004
                  </div>
                  <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                    <MapPin size={12} /> Đắk Lắk
                  </div>
                </div>
                
                <div className="text-4xl md:text-5xl text-white font-black leading-tight italic tracking-tightest">
                  <span className="text-primary italic text-6xl md:text-8xl block mb-6">Xin chào,</span>
                  Mình là <span className="text-gradient not-italic underline decoration-white/10 underline-offset-[12px]">{BIO_DATA.name}</span>. Mình sinh ra và lớn lên tại {BIO_DATA.location}, hiện đang là sinh viên ngành {BIO_DATA.education} tại UIT.
                </div>
                
                <p className="text-slate-500 text-xl font-medium leading-[1.8] italic max-w-2xl border-l-2 border-white/5 pl-8">
                  Tại UIT, mình đã tìm thấy niềm đam mê mãnh liệt với lập trình. Hiện tại, mình đang làm việc tại <span className="text-primary font-black uppercase tracking-tighter not-italic">f17team</span> với vai trò <span className="text-white">Software Developer</span>, đảm nhận phát triển các giải pháp từ Frontend, Backend cho đến quản trị Database.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Professional Craft */}
          <motion.div variants={itemVariants} className="md:col-span-4 space-y-8">
            <SpotlightCard className="bg-primary/5 border-primary/20 group py-16 px-10" glowColor="rgba(34, 197, 94, 0.15)">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl text-primary flex items-center justify-center group-hover:scale-110 transition-all duration-700 shadow-2xl shadow-primary/20">
                  <Code2 size={40} />
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl italic uppercase tracking-tightest leading-none mb-2">Kỹ NĂNG</h3>
                  <div className="h-1 w-12 bg-primary/30 rounded-full" />
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { icon: <Layers size={18} />, label: "Frontend & Backend Development" },
                  { icon: <Database size={18} />, label: "Database Management" },
                  { icon: <Cpu size={18} />, label: "Problem Solving & Logic" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-400 font-bold italic text-[14px] hover:text-white transition-all cursor-default group/item">
                    <span className="text-primary/50 group-hover/item:text-primary transition-all">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard className="bg-white/[0.01] border-white/5 p-12" glowColor="rgba(255, 255, 255, 0.05)">
              <h3 className="text-white font-black text-xl italic uppercase tracking-tightest mb-6 flex items-center gap-3">
                <Heart size={18} className="text-rose-400" /> Ước Mơ
              </h3>
              <p className="text-slate-500 font-medium italic leading-[1.7] text-[15px]">
                Xây dựng những sản phẩm công nghệ hữu ích, mang lại giá trị thực tế cho cộng đồng và không ngừng hoàn thiện bản thân mỗi ngày.
              </p>
            </SpotlightCard>
          </motion.div>
        </div>

        {/* Self-Growth Section */}
        <div className="mb-40">
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <Zap size={14} /> Sự CÂN BẰNG
              </div>
              <h2 className="text-6xl md:text-[6rem] font-black italic uppercase tracking-tightest">
                ĐỜI <span className="text-gradient not-italic">THƯỜNG.</span>
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GROWTH_CARDS.map((card, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Magnetic strength={0.1}>
                  <SpotlightCard 
                    className="p-12 border-white/5 hover:border-white/10 group h-full" 
                    glowColor={card.glow}
                  >
                    <div className={`w-20 h-20 rounded-2xl bg-${card.color}-500/10 flex items-center justify-center text-${card.color}-400 mb-10 border border-${card.color}-500/20 shadow-2xl shadow-black/80 group-hover:scale-110 transition-all duration-700`}>
                      {card.icon}
                    </div>
                    <h3 className="text-3xl font-black mb-6 tracking-tight uppercase italic text-white">
                      {card.title.split('.')[0]} <span className={`text-${card.color}-400 not-italic`}>{card.title.split('.')[1] || '.'}</span>
                    </h3>
                    <p className="text-slate-500 text-lg font-medium leading-[1.7] italic">
                      {card.desc}
                    </p>
                  </SpotlightCard>
                </Magnetic>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <motion.div 
          variants={itemVariants}
          className="relative py-40 rounded-[5rem] overflow-hidden border border-white/5 bg-white/[0.01] text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50" />
          <div className="relative z-10 px-6">
            <h2 className="text-6xl md:text-[8rem] font-black italic uppercase tracking-tightest mb-12 leading-[0.9]">
              HÃY <span className="text-gradient not-italic">KẾT NỐI.</span>
            </h2>
            <p className="text-slate-500 text-2xl font-medium italic mb-20 max-w-3xl mx-auto leading-relaxed">
              Dù là một dự án mới, một chia sẻ về công nghệ hay đơn giản chỉ là một lời chào, mình luôn sẵn lòng lắng nghe.
            </p>
            <Magnetic strength={0.2}>
              <Link href="mailto:your-email@example.com" className="inline-block">
                <button className="px-20 py-10 bg-white text-slate-950 text-2xl font-black uppercase tracking-tightest italic rounded-[2.5rem] hover:bg-primary hover:text-white transition-all duration-700 shadow-2xl shadow-white/5">
                   GỬI TIN NHẮN CHO BẢO
                </button>
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
