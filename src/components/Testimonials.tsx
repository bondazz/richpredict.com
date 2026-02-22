"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "James Wilson",
        text: "I was skeptical at first but damn, these AI picks are actually legit. Hit a 4-fold parlay last night thanks to the EPL stats. App is clean too.",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        stars: 5,
    },
    {
        name: "Merve Korkmaz",
        text: "Vallahi çok iyi. Diğer siteler gibi kafa karıştırmıyor, direkt nokta atışı tahminler var. Özellikle basketbol kısmını çok beğendim.",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        stars: 5,
    },
    {
        name: "Artem Sokolov",
        text: "Реально крутой инструмент для ставок. Аналитика по футболу просто топовая, сэкономил кучу времени на разборе матчей. Респектую разработчикам.",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        stars: 5,
    },
    {
        name: "Thomas Dubois",
        text: "Le design est super fluide et les prédictions sont très précises pour la Ligue 1. Ça change des tipsters bidon sur Insta.",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        stars: 5,
    },
    {
        name: "Lukas Weber",
        text: "Beste App für Bundesliga Tipps. Die KI-Statistiken sind Gold wert. Hatte erst Bedenken wegen des Abos, aber es hat sich schon im ersten Monat gelohnt.",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
        stars: 5,
    },
    {
        name: "Giulia Bianchi",
        text: "Finalmente qualcosa di professionale. Uso RichPredict per la Serie A e devo dire che la precisione dell'IA mi ha sorpresa parecchio. Consigliatissima!",
        image: "https://randomuser.me/api/portraits/women/10.jpg",
        stars: 5,
    },
    {
        name: "Carlos Ruiz",
        text: "Muy buena interfaz y los datos son sólidos. Me gusta que no hay anuncios molestos. Las señales de IA me han ayudado a ganar varias combinadas.",
        image: "https://randomuser.me/api/portraits/men/7.jpg",
        stars: 5,
    },
    {
        name: "Vüsal Əliyev",
        text: "Uşaqlar, sayt ciddidir. Əvvəl inanmırdım amma AI həqiqətən dəqiq analiz verir. İngiltərə liqasında qəşəng qazancım oldu. Hamıya məsləhətdir.",
        image: "https://randomuser.me/api/portraits/men/9.jpg",
        stars: 5,
    },
    {
        name: "Sophie Bennett",
        text: "Actually impressed. Usually these sites are half-baked but this feels premium. Won 3 bets in a row purely following the IA signals today.",
        image: "https://randomuser.me/api/portraits/women/8.jpg",
        stars: 5,
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const StarRating = ({ count }: { count: number }) => {
    return (
        <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "p-0.5 rounded-sm flex items-center justify-center",
                        i < count ? "bg-[#00b67a]" : "bg-zinc-700"
                    )}
                >
                    <svg viewBox="0 0 20 20" fill="white" className="w-2.5 h-2.5">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                </div>
            ))}
        </div>
    );
};

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
                className="flex flex-col gap-4 pb-4"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {props.testimonials.map(({ text, image, name, stars }, i) => (
                                <div
                                    className="p-5 rounded-xl border border-white/5 bg-[#0a1118]/80 backdrop-blur-sm shadow-xl max-w-[260px] w-full group hover:border-[#00b67a]/40 transition-all duration-300"
                                    key={i}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-10 h-3 flex items-center gap-0.5">
                                                <StarRating count={stars} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[12px] leading-relaxed text-white/90 font-medium mb-4">"{text}"</div>

                                    <div className="flex items-center gap-2.5 pt-3 border-t border-white/5">
                                        <img
                                            width={28}
                                            height={28}
                                            src={image}
                                            alt={name}
                                            className="h-7 w-7 rounded-full object-cover border border-white/10"
                                        />
                                        <div className="flex flex-col">
                                            <div className="text-[10px] font-bold text-white uppercase tracking-tight">{name}</div>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <div className="w-2.5 h-2.5 bg-[#00b67a] rounded-full flex items-center justify-center">
                                                    <svg viewBox="0 0 20 20" fill="white" className="w-1.5 h-1.5">
                                                        <path d="M7.629 14.571L3.125 10.065l1.547-1.547 2.957 2.957 6.138-6.139 1.547 1.547-7.685 7.688z" />
                                                    </svg>
                                                </div>
                                                <span className="text-[8px] font-medium text-white/40 uppercase tracking-tighter">Verified</span>
                                            </div>
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
        <section className="relative my-20 overflow-hidden">
            <div className="container z-10 mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-[600px] mx-auto mb-12"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-[#00b67a] p-1 rounded-sm">
                                    <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#00b67a]">Excellent</span>
                        <div className="h-3 w-[1px] bg-white/10 mx-1" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-white/60">Trustpilot</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-center uppercase leading-none">
                        Our Community <span className="text-[var(--fs-yellow)]">Loves RichPredict</span>
                    </h2>
                    <p className="text-center mt-4 text-[11px] font-medium text-white/40 leading-relaxed max-w-[350px]">
                        Over 50,000+ analysts worldwide rely on our AI-powered signals every single day.
                    </p>
                </motion.div>

                <div className="flex justify-center gap-4 mt-8 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[500px] overflow-hidden relative">
                    <TestimonialsColumn testimonials={firstColumn} duration={20} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={28} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={24} />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,182,122,0.02),transparent_70%)] pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
