import FirstBanner from '@/components/FirstBanner';
import AppLayout from '@/layouts/app-layout';
import OffersSwiper from '@/components/offersSwiper';
import AboutSection from '@/components/about';
import ContactFormCard from '@/components/contactFormCard';
import FooterCard from '@/components/footer';

export default function Welcome() {
    return (
        <AppLayout>
            <div className="flex min-h-screen flex-col items-center  p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a] bg-[#FDFDFC]">
                <FirstBanner />
                <OffersSwiper />
                <AboutSection />
                <ContactFormCard />
            </div>
        </AppLayout>
    );
}
