import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import { TitleProvider } from '@/context/TitleContext'
import { getPinnedLeagues, getCountriesByRegion, getPredictions, getBlogPosts } from '@/lib/supabase'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [pinnedLeagues, allCountries, footballPredictions, tennisPredictions, latestNews] = await Promise.all([
    getPinnedLeagues(),
    getCountriesByRegion(),
    getPredictions(8, 'Football'),
    getPredictions(8, 'Tennis'),
    getBlogPosts(8)
  ]);

  // Group countries by region
  const countriesByRegion = allCountries.reduce((acc: any, country: any) => {
    const regionObj = country.regions || country.region;
    const regionName = regionObj?.name || "Other";
    if (!acc[regionName]) acc[regionName] = [];
    acc[regionName].push(country);
    return acc;
  }, {});

  const regionOrder = ["Europe", "South America", "World", "Africa", "Asia", "North & Central America", "Australia & Oceania"];

  return (
    <TitleProvider>
      <div className="flex flex-col min-h-screen">
        <Header
          pinnedLeagues={pinnedLeagues}
          countriesByRegion={countriesByRegion}
          regionOrder={regionOrder}
        />
        <main className="flex-1 w-full bg-[var(--fs-bg)]">
          {children}
        </main>
        <Footer
          footballPredictions={footballPredictions}
          tennisPredictions={tennisPredictions}
          latestNews={latestNews}
        />
      </div>
    </TitleProvider>
  )
}
