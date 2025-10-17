import FirstBanner from '@/components/FirstBanner';
import AppLayout from '@/layouts/app-layout';
import OffersSwiper from '@/components/offersSwiper';
import AboutSection from '@/components/about';
import ContactFormCard from '@/components/contactFormCard';
import { usePage } from '@inertiajs/react';

// ⬇️ dodaj
import ActivePopupModal from '@/components/ActivePopupModal';

export default function Welcome() {
    const { offers, activePopup } = usePage().props as {
        offers: any[];
        activePopup?: { id:number; name:string; link:string|null; image_url:string|null } | null;
    };

    return (
        <AppLayout>
            <div className="flex min-h-screen flex-col items-center p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a] bg-[#FDFDFC]">
                <FirstBanner />

                <section id="oferty" className="w-full scroll-mt-4">
                    <OffersSwiper offers={offers ?? []} />
                </section>

                <section id="o-nas" className="w-full">
                    <AboutSection />
                </section>

                <section id="kontakt" className="w-full scroll-mt-4">
                    <ContactFormCard />
                </section>
            </div>

        </AppLayout>
    );
}
