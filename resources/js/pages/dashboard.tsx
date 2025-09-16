import ContactFormCard from '@/components/contactFormCard';
import FooterCard from '@/components/footer';
import MapCard from '@/components/mapCard';
import OffersSwiper from '@/components/offersSwiper';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <OffersSwiper />
            <ContactFormCard />
            <MapCard address="Senior na Plus, Gliwice" />
            <FooterCard />
        </AppLayout>
    );
}
