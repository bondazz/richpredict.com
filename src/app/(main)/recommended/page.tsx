import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Globe, BarChart3, Trophy, CircleDollarSign, Zap, Users, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Recommended Sites',
    description: 'A comprehensive directory of premium sports statistics, betting tools, live scores, and fan resources.',
    alternates: {
        canonical: '/recommended',
    },
}

const recommendedSites = [
    {
        category: "Statistics websites",
        icon: <BarChart3 size={18} />,
        sites: [
            { name: "Soccer Stats", url: "https://www.betexplorer.com/" },
            { name: "Betting Tips 1X2", url: "https://afootballreport.com/predictions/1X2-football-tips" },
            { name: "Bari91 Stats", url: "http://www.bari91.com" },
            { name: "StatArea", url: "http://www.statarea.com/" },
            { name: "BetBallers Tool", url: "https://betballers.com/" },
            { name: "Smart Bet Tracker", url: "https://www.smartbettracker.com" },
            { name: "Football Database", url: "https://www.footballdatabase.eu/en/" },
            { name: "Pro Sports Statistics", url: "https://www.statscrew.com/" },
            { name: "Historical Soccer DB", url: "https://www.bdfutbol.com/" },
            { name: "UEFA Rankings", url: "https://www.football-coefficient.eu/" },
            { name: "AI Football Predictions", url: "https://www.aitipster.com/" },
            { name: "IPL Match Prediction", url: "https://possible11.com/series/indian-premier-league-ipl-2025/fixture/" },
        ]
    },
    {
        category: "Sports websites",
        icon: <Trophy size={18} />,
        sites: [
            { name: "Tennis Betting", url: "https://www.tennisexplorer.com" },
            { name: "Soccerway Scores", url: "https://www.soccerway.com/" },
            { name: "EPL Results", url: "https://www.soccerway.com/england/premier-league/" },
            { name: "Football Live Scores", url: "https://www.scorebar.com/" },
            { name: "Sports Data API", url: "https://www.enetpulse.com/" },
            { name: "GrandPrix247 F1", url: "https://www.grandprix247.com/" },
            { name: "1000 Goals", url: "http://www.1000goals.com" },
            { name: "The Rugby Paper", url: "https://www.therugbypaper.co.uk/" },
            { name: "TheSports.org", url: "https://www.the-sports.org/" },
            { name: "Daily Cannon", url: "https://dailycannon.com/" },
            { name: "Biathlon World Cup", url: "https://sportindepth.com/index.php/biathlon/" },
            { name: "Deep Sports Analysis", url: "https://deepsportsanalysis.com/" },
            { name: "Churchofedge", url: "https://churchofedge.com/" },
            { name: "Tennis News", url: "https://tennisuptodate.com/" },
            { name: "Ghana Sports News", url: "https://ghanaguardian.com/category/sports" },
            { name: "Ghana Soccer News", url: "https://footballghana.com/" },
            { name: "Qatar Football News", url: "https://qatar-soccer.net/" },
            { name: "thehexblog.com", url: "https://thehexblog.com/" },
            { name: "Enjoy Tennis Blog", url: "https://enjoytennisblog.wordpress.com/" },
            { name: "Holding Midfield", url: "https://www.holdingmidfield.com/" },
            { name: "Live Sport TV", url: "https://www.livesporttv.com" },
            { name: "Bulinews", url: "https://bulinews.com/" },
            { name: "Football Streams", url: "https://www.livesoccertv.com/" },
            { name: "Tennis Connected", url: "https://tennisconnected.com/home/" },
            { name: "Cleto Reyes Gloves", url: "https://atlfightshop.com/collections/cleto-reyes" },
            { name: "Football Talk", url: "https://football-talk.co.uk/" },
            { name: "Arsenal Station", url: "https://www.arsenalstation.com/" },
            { name: "Isoccerng", url: "https://isoccerng.com/" },
            { name: "Football Extras", url: "https://www.footballextras.net/" },
            { name: "Sportslibro", url: "https://sportslibro.com/" },
            { name: "Tribal Football", url: "https://www.tribalfootball.com/" },
            { name: "SocaPro.com", url: "https://socapro.com/" },
            { name: "Cycling Up To Date", url: "https://cyclinguptodate.com/" },
            { name: "Beach Soccer", url: "https://beachsoccer.com/" },
            { name: "Street Handball", url: "https://www.streethandball.com/" },
            { name: "FootyRoom", url: "https://footyroom.co/" },
            { name: "Fight Matrix", url: "https://www.fightmatrix.com/" },
            { name: "Player Agencies", url: "https://www.footballagencies.com/" },
        ]
    },
    {
        category: "Betting websites",
        icon: <CircleDollarSign size={18} />,
        sites: [
            { name: "Free Football Tips", url: "https://www.topfootballtipster.com/" },
            { name: "Football-Data UK", url: "http://www.football-data.co.uk/" },
            { name: "Online Betting UK", url: "http://www.online-betting.me.uk/" },
            { name: "TyperSi Tips", url: "https://typersi.com" },
            { name: "Betrush Picks", url: "http://www.betrush.com" },
            { name: "Vitibet Tips", url: "http://www.vitibet.com" },
            { name: "OddsPortal EPL", url: "https://www.oddsportal.com/soccer/england/premier-league/" },
            { name: "VirtualBet24", url: "http://www.virtualbet24.com" },
            { name: "Betting Family", url: "https://bettingfamily.com/en" },
            { name: "Horse Racing Tips", url: "https://www.horseracingtips.org.uk/" },
            { name: "BetRegular", url: "http://www.betregular.com/" },
            { name: "Feedinco Predictions", url: "https://www.feedinco.com/predictions" },
            { name: "Sportmarket Broker", url: "https://www.sportmarket.com/" },
            { name: "Tipster Competition", url: "https://tipstercompetition.com/" },
            { name: "Matched Betting Blog", url: "https://matchedbettingblog.com/" },
            { name: "US Betting 24", url: "https://www.usbetting24.com/" },
            { name: "BettingFellow", url: "https://bettingfellow.com/" },
            { name: "Winonbetonline", url: "https://www.winonbetonline.com/" },
            { name: "Pecheli Guide", url: "https://pecheli.net/" },
            { name: "Value Betting Soft", url: "https://surebetadvice.com/value-betting-software/" },
            { name: "EnetOdds", url: "https://enetodds.com/" },
            { name: "Betimate Today", url: "https://betimate.com/en/football-predictions/today" },
            { name: "Tipya Dagens", url: "https://tipya.com/dagens-spilforslag" },
            { name: "SureBets.bet", url: "https://surebets.bet/" },
            { name: "Predicd AI", url: "https://www.predicd.com/" },
            { name: "Betpack Free Bets", url: "https://www.betpack.com/offers/free-bets-no-deposit/" },
            { name: "CapperTek Picks", url: "https://www.cappertek.com/accessPicks.asp" },
            { name: "Focus Predict", url: "https://focuspredict.com/" },
            { name: "Before You Bet", url: "https://www.beforeyoubet.com.au/" },
            { name: "Michigan Betting", url: "https://www.bestbettingmichigan.com/" },
            { name: "New Jersey Betting", url: "https://www.bestbettingnewjersey.com/" },
            { name: "Premium Tips", url: "https://tips.gg/premium/" },
            { name: "Bet of the Day", url: "https://sportsbuddy.ng/bet-of-the-day" },
            { name: "xGscore Tips", url: "https://xgscore.io/" },
            { name: "Tipster Reviews", url: "https://tipsterreviews.co.uk/category/tipsters/" },
            { name: "Tribuna Betting", url: "https://tribuna.com/en/betting/" },
            { name: "Sportsgambler", url: "https://www.sportsgambler.com/" },
            { name: "NerdyTips AI", url: "https://nerdytips.com/" },
        ]
    },
    {
        category: "Live scores websites",
        icon: <Zap size={18} />,
        sites: [
            { name: "Soccer 24", url: "https://www.soccer24.com/" },
            { name: "LiveScore.in", url: "https://www.livescore.in" },
            { name: "Flashscore UK", url: "https://www.flashscore.co.uk" },
            { name: "A-League Scores", url: "https://www.flashscore.com.au/football/australia/a-league/" },
            { name: "Scores Zilla", url: "http://www.scoreszilla.com" },
            { name: "Enetpulse", url: "https://enetpulse.com/" },
            { name: "Footy Scores", url: "https://www.footyscores.co.uk" },
            { name: "Goaloo88", url: "https://www.goaloo88.com/" },
            { name: "Flashscore Thai", url: "https://www.flashscorethai.com/" },
            { name: "Flashscore USA", url: "https://www.flashscoreusa.com/" },
        ]
    },
    {
        category: "Fans websites",
        icon: <Users size={18} />,
        sites: [
            { name: "FM Inside", url: "https://fminside.net/" },
            { name: "Newcastle FC News", url: "https://www.nufcblog.co.uk/" },
            { name: "Valencia CF News", url: "https://www.clubvalenciacf.com/" },
            { name: "VIP SG (PSG News)", url: "https://www.vipsg.net/" },
            { name: "Chelsea Transfers", url: "https://www.chelseafootballnews.com/" },
        ]
    }
]

export default function RecommendedSitesPage() {
    return (
        <div className="min-h-screen bg-[var(--fs-bg)] py-8 px-4">
            <div className="max-w-[1100px] mx-auto space-y-8">

                {/* Hero section - Compact */}
                <div className="relative bg-[#000a0f] border border-white/5 rounded-2xl p-6 md:p-10 overflow-hidden">
                    <div className="relative z-10 max-w-xl">
                        <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tighter mb-4 uppercase">
                            Premium <span className="text-[var(--fs-yellow)]">Partners</span> & Resources
                        </h2>
                        <p className="text-[13px] text-white/40 leading-relaxed font-medium">
                            A curated collection of trusted sports platforms and analytical tools. We hand-pick our partners to ensure you have access to the most reliable statistics and insights in the industry.
                        </p>
                    </div>

                    {/* Abstract design elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,var(--fs-yellow)/0.03,transparent_70%)] pointer-events-none" />
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 gap-8">
                    {recommendedSites.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <div className="flex items-center gap-3 px-1">
                                <div className="w-8 h-8 rounded-lg bg-[var(--fs-yellow)] text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,228,56,0.15)]">
                                    {section.icon}
                                </div>
                                <h3 className="text-base font-black text-white uppercase tracking-wider">
                                    {section.category}
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-2" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {section.sites.map((site, sIdx) => (
                                    <a
                                        key={sIdx}
                                        href={site.url}
                                        target="_blank"
                                        rel="nofollow noopener noreferrer"
                                        className="group relative bg-[#ffffff]/[0.02] border border-white/5 p-3 rounded-lg hover:bg-[var(--fs-yellow)]/[0.03] hover:border-[var(--fs-yellow)]/30 transition-all duration-300 flex items-center justify-between"
                                    >
                                        <div className="flex flex-col gap-0.5 max-w-[80%]">
                                            <span className="text-[11px] font-bold text-white uppercase tracking-tight group-hover:text-[var(--fs-yellow)] transition-colors line-clamp-1">
                                                {site.name}
                                            </span>
                                            <span className="text-[8px] text-white/20 font-black uppercase tracking-widest group-hover:text-white/40 transition-colors">
                                                Partner Resource
                                            </span>
                                        </div>
                                        <div className="w-6 h-6 rounded flex items-center justify-center group-hover:translate-x-0.5 transition-transform opacity-20 group-hover:opacity-100">
                                            <ExternalLink size={10} className="text-white group-hover:text-[var(--fs-yellow)] transition-colors" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-8 bg-gradient-to-b from-white/5 to-transparent border-t border-white/5 text-center pt-12 pb-8">
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
                        RichPredict Global Network &copy; 2026
                    </p>
                </div>

            </div>
        </div>
    )
}
