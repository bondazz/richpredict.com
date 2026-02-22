import Link from "next/link";

interface SEOContentProps {
    match: any;
}

export default function SEOContent({ match }: SEOContentProps) {
    if (!match) return null;

    const homeTeam = match.home_team || "Home Team";
    const awayTeam = match.away_team || "Away Team";
    const sport = (match.category || "Football").toLowerCase();
    const matchName = `${homeTeam} vs ${awayTeam}`;

    const aiStack = "ChatGPT-4, Google Gemini Ultra, Claude 3.5, and more than 50 specialized neural network clusters";
    const expertExperience = "24+ years of professional institutional analysis";

    const getStrings = () => {
        if (sport === "tennis") {
            return {
                title: `${matchName} Technical Forecast & Surface Intelligence`,
                p2: `The raw data extracted from our neural clusters undergoes a secondary validation phase managed by our senior scouts and analysts. With over ${expertExperience}, our team manually scrutinizes every outcome, ensuring that psychological factors and physical condition reports are perfectly synchronized with the AI's output. This hybrid methodology transforms standard match data into institutional-grade intelligence for professional enthusiasts.`,
                p3: `Every technical aspect of the ${matchName} fixture, from serve efficiency to baseline conversion rates, is meticulously mapped. By combining multi-layered AI architectures with decades of seasoned human observation, we deliver an analytical edge that transcends traditional sports forecasting. Our commitment to high-fidelity data ensures that every user receives the most comprehensive technical breakdown available in the modern digital era.`
            };
        } else if (sport === "basketball") {
            return {
                title: `${matchName} Strategic Court Analytics & Performance Node`,
                p2: `To maintain a world-class standard of insight, our internal committee of experts—boasting ${expertExperience}—reviews every AI-generated signal. We blend the brute processing power of modern machine learning with deep-rooted human expertise to account for momentum shifts and situational variables that standard algorithms might ignore. This ensures a comprehensive and reliable overview for the most demanding technical observers.`,
                p3: `By accessing our ${matchName} data cluster, you are utilizing a system precision-engineered for professional-grade previews. Our analytical framework dissects thousands of data points per game, delivering a seamless stream of strategic information. We focus on high-probability outcomes and granular performance indicators, providing a definitive resource for those who value institutional-level sports analytics.`
            };
        } else {
            return {
                title: `${matchName} Professional Analysis & AI Strategic Forecasting`,
                p2: `Beyond standard algorithmic output, every forecast on this site is subject to rigorous verification by our veteran analysts. With ${expertExperience} in the global football industry, our experts apply a specialized human filter to the AI's data. This critical step ensures that the final ${matchName} output reflects not just mathematical probabilities, but also the nuanced 'human element' that defines the beautiful game, providing a truly professional-grade outlook.`,
                p3: `Our service is designed to provide a definitive analytical edge by bridging the gap between raw data and actionable intelligence. From expected goals (xG) to defensive transition metrics, the ${matchName} fixture is analyzed with surgical precision. We invite our users to explore our vast directory of institutional match previews, all of which are engineered to the highest standards of technical excellence and strategic depth.`
            };
        }
    };

    const strings = getStrings();

    return (
        <section className="mt-20 mb-16 px-4 text-center max-w-4xl mx-auto">
            <div className="space-y-8">
                <h2 className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.4em] text-white/90 font-mono">
                    {strings.title}
                </h2>

                <div className="text-[10px] md:text-[11px] text-white/70 leading-relaxed space-y-8 font-normal max-w-3xl mx-auto">
                    <div>
                        {sport === "tennis" ? (
                            <p>Utilizing the robust analytical infrastructure of <Link href="/" className="text-white hover:underline underline-offset-4" rel="dofollow">RICHPREDICT</Link>, this {matchName} preview is generated through a sophisticated ensemble of {aiStack}. Our proprietary RP-GPT engine processes real-time court dynamics, player biomechanics, and historical performance nodes to achieve a tactical precision rate exceeding 95% for all <Link href="/predictions" className="text-white hover:underline underline-offset-4" rel="dofollow">tennis predictions</Link> published on our platform.</p>
                        ) : sport === "basketball" ? (
                            <p>The {matchName} tactical forecast is a product of high-intensity computational modeling involving {aiStack}. Driving this synthesis is the <Link href="/" className="text-white hover:underline underline-offset-4" rel="dofollow">RICHPREDICT</Link> RP-GPT system, which pushes data accuracy thresholds toward a 95%+ margin by cross-referencing offensive efficiency, defensive rotations, and pace-adjusted metrics for our <Link href="/predictions" className="text-white hover:underline underline-offset-4" rel="dofollow">basketball predictions</Link>.</p>
                        ) : (
                            <p>This comprehensive {matchName} preview is powered by the elite <Link href="/" className="text-white hover:underline underline-offset-4" rel="dofollow">RICHPREDICT</Link> engine, which integrates the processing capabilities of {aiStack}. Our custom-built RP-GPT architecture leads the industry with a 95%+ accuracy threshold for <Link href="/predictions" className="text-white hover:underline underline-offset-4" rel="dofollow">football predictions</Link>, meticulously evaluating thousands of tactical data nodes, player fitness variables, and historical team dynamics.</p>
                        )}
                    </div>

                    <p>
                        {strings.p2}
                    </p>

                    <p>
                        {strings.p3}
                    </p>

                    <div className="pt-8 border-t border-white/5">
                        <p className="text-[9px] text-white/40 uppercase tracking-[0.1em]">
                            Responsible Engagement Protocol:
                        </p>
                        <p className="text-[9px] text-white/30 mt-2 uppercase tracking-tight leading-normal">
                            Participation in betting entails notable financial risk and should only be undertaken with disposable capital. <Link href="/" className="hover:text-white underline underline-offset-2" rel="dofollow">RichPredict</Link> provides objective analytical forecasts, not guaranteed commercial results. Please engage with all sports predictions responsibly and within your legal jurisdiction.
                        </p>
                    </div>
                </div>

                <div className="pt-6 flex justify-center gap-10 opacity-10">
                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-white" />
                    <div className="size-1 rounded-full bg-white" />
                    <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-white" />
                </div>
            </div>
        </section>
    );
}
