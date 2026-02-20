import Link from "next/link";

interface SEOContentProps {
    match: any;
}

export default function SEOContent({ match }: SEOContentProps) {
    const homeTeam = match.home_team;
    const awayTeam = match.away_team;
    const league = match.league || "Professional Football Leagues";
    const matchName = `${homeTeam} vs ${awayTeam}`;

    return (
        <section className="bg-[var(--fs-header)] border border-white/5 rounded-sm p-8 space-y-6 mt-6">
            <div className="prose prose-invert max-w-none">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white font-[Klapt] mb-6">
                    Professional Analysis: {matchName} Predictions & Match Insight
                </h2>

                <div className="text-[11px] md:text-[12px] text-white/40 leading-relaxed space-y-4">
                    <p>
                        <strong className="text-white/60">HELP:</strong> You are on the <strong className="text-white/70">{matchName}</strong> prediction page in the Football/{league} section. <Link href="/" className="text-[var(--fs-yellow)]/80 font-bold hover:underline" rel="dofollow">RICHPREDICT</Link> offers {matchName} AI-powered predictions, final and partial win probabilities, head-to-head statistics, and deep-dive match insights. Our platform processes complex data nodes to deliver the most accurate outlook for this specific encounter, ensuring you have every relevant metric at your fingertips.
                    </p>

                    <p>
                        Besides <strong className="text-white/70">{matchName}</strong> predictions, you can follow 1000+ football competitions from 90+ countries around the world on the <Link href="/predictions" className="text-[var(--fs-yellow)]/80 font-bold hover:underline" rel="dofollow">football predictions</Link> section. Simply browse through our comprehensive country menu on the left to select your desired competition. Each prediction is tailored to provide a professional intent and analytical edge, covering a wide range of outcomes. Our service is designed for those who demand professional-grade match previews that go beyond simple scorelines.
                    </p>
                </div>
            </div>
        </section>
    );
}
