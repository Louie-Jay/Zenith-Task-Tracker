import { CTA } from '@/components/CTA';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { TaskPreview } from '@/components/TaskPreview';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <main className="min-h-screen">
                <Hero canRegister={canRegister} auth={auth} />
                <Features />
                <TaskPreview />
                <CTA />
                <Footer />
            </main>
        </>
    );
}
