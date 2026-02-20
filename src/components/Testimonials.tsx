"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const testimonials = [
    {
        text: "AI proqnozları inanılmazdır! Premier League oyunlarında 85% dəqiqliklə qalib gəldim. Dizayn isə çox sürətlidir.",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        name: "Leyla Məmmədova",
        role: "Premium Analitik",
    },
    {
        text: "Flashscore-dan daha rahatdır. Xüsusilə dərin statistika və süni intellekt analizi hər oyuna fərqli baxmağa kömək edir.",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        name: "Vüsal Əliyev",
        role: "İdman Jurnalisti",
    },
    {
        text: "Mobil istifadə çox rahatdır. Canlı nəticələri izləyərkən AI siqnalları mənə çox vaxt qazandırır. Təşəkkürlər!",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        name: "Səbinə Qasımova",
        role: "Professional Bettor",
    },
    {
        text: "Saytın hər detalı premium hiss etdirir. Qara tema və sürətli keçidlər mükəmməldir. Hər kəsə tövsiyə edirəm.",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        name: "Ömər Rzayev",
        role: "Texnologiya Bloqeri",
    },
    {
        text: "İllərdir bu sahədəyəm, belə dəqiq alqoritmlə ilk dəfə qarşılaşıram. RICHPREDICT həqiqətən oyunu dəyişir.",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        name: "Zeynəb Hüseynova",
        role: "Data Analitik",
    },
    {
        text: "Liqaların bu qədər çox olması böyük üstünlükdür. Az tanınan liqalarda belə AI proqnozları çox güclüdür.",
        image: "https://randomuser.me/api/portraits/women/6.jpg",
        name: "Əlizadə Xumar",
        role: "Strateji Menecer",
    },
    {
        text: "İstifadəçi təcrübəsi 10/10. Heç bir artıq reklam yoxdur, yalnız mühüm məlumatlar və dəqiq proqnozlar.",
        image: "https://randomuser.me/api/portraits/men/7.jpg",
        name: "Fərhad Siddiqi",
        role: "Marketinq Direktoru",
    },
    {
        text: "Müştəri xidmətləri və dəstək komandası çox sürətlidir. Premium abunəlik hər bir qəpiyinə dəyər.",
        image: "https://randomuser.me/api/portraits/women/8.jpg",
        name: "Səna Şeyx",
        role: "Satış Meneceri",
    },
    {
        text: "E-kommersiya ilə məşğul oluram və bu platformanın analiz alətləri mənə maliyyə idarəçiliyində işarə verir.",
        image: "https://randomuser.me/api/portraits/men/9.jpg",
        name: "Həsən Əli",
        role: "E-ticarət Meneceri",
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const TestimonialsColumn = (props: {
    className?: string;
    testimonials: typeof testimonials;
    duration?: number;
}) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {props.testimonials.map(({ text, image, name, role }, i) => (
                                <div
                                    className="p-8 rounded-2xl border border-white/5 bg-[var(--fs-header)] shadow-2xl max-w-xs w-full group hover:border-[var(--fs-yellow)]/30 transition-all duration-300"
                                    key={i}
                                >
                                    <div className="text-[13px] leading-relaxed text-white/80 italic font-medium">"{text}"</div>
                                    <div className="flex items-center gap-3 mt-6">
                                        <img
                                            width={32}
                                            height={32}
                                            src={image}
                                            alt={name}
                                            className="h-8 w-8 rounded-full border border-white/10"
                                        />
                                        <div className="flex flex-col">
                                            <div className="text-[11px] font-black text-white/90 uppercase tracking-tight">{name}</div>
                                            <div className="text-[9px] font-bold text-[var(--fs-yellow)]/60 uppercase tracking-widest">{role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.div>
        </div>
    );
};

export function Testimonials() {
    return (
        <section className="relative my-24 overflow-hidden">
            <div className="container z-10 mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-[600px] mx-auto mb-16"
                >
                    <div className="flex justify-center mb-6">
                        <div className="border border-[var(--fs-yellow)]/30 bg-[var(--fs-yellow)]/5 text-[var(--fs-yellow)] py-1.5 px-6 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                            Community Voice
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-center uppercase leading-none">
                        What our Premium <span className="text-[var(--fs-yellow)]">Users Say</span>
                    </h2>
                    <p className="text-center mt-6 text-[12px] font-medium text-white/40 leading-relaxed max-w-[400px]">
                        Join the elite circle of analysts who rely on AI-powered insights for game-changing results.
                    </p>
                </motion.div>

                <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[640px] overflow-hidden relative">
                    <TestimonialsColumn testimonials={firstColumn} duration={25} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />

                    {/* Subtle glow background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,228,56,0.03),transparent_70%)] pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
