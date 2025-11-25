import { dashboard, login, register } from '@/routes';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export const Hero = ({
    canRegister,
    auth,
}: {
    canRegister?: any;
    auth?: any;
}) => {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
            {/* Background geometric pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 h-64 w-64 rotate-12 border-4 border-foreground" />
                <div className="absolute right-10 bottom-20 h-96 w-96 -rotate-6 border-4 border-foreground" />
                <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground" />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-24">
                <div className="mx-auto max-w-5xl space-y-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-4 py-2">
                        <div className="h-2 w-2 animate-pulse bg-foreground" />
                        <span className="text-sm font-semibold tracking-wider uppercase">
                            Peak Productivity
                        </span>
                    </div>

                    {/* Main headline */}
                    <h1 className="text-6xl leading-none font-black tracking-tighter md:text-8xl">
                        Reach Your
                        <br />
                        <span className="mt-2 inline-block bg-foreground px-6 py-2 text-background">
                            ZENITH
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mx-auto max-w-2xl text-xl font-medium text-muted-foreground md:text-2xl">
                        Task management stripped to its essence. No
                        distractions. Just pure focus on what matters most.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
                        <Link
                            href={auth.user ? dashboard() : login()}
                            // size="lg"
                            className="flex group bg-foreground px-8 py-6 text-lg font-bold text-background hover:bg-accent"
                        >
                            {auth.user ? 'Go to Dashboard' : 'Login'}
                            <ArrowRight className="ml-2 mt-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        {canRegister && (
                            <Link
                                // size="lg"
                                href={register()}
                                // variant="outline"
                                className="border-2 border-foreground bg-transparent px-8 py-6 text-lg font-bold outline hover:bg-foreground hover:text-background"
                            >
                                Register
                            </Link>
                        )}
                    </div>

                    {/* Social proof */}
                    <div className="flex flex-col items-center gap-4 pt-12">
                        <div className="flex items-center gap-8 text-sm font-semibold">
                            <div className="flex items-center gap-2">
                                <div className="h-[2px] w-8 bg-foreground" />
                                <span>10K+ Users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-[2px] w-8 bg-foreground" />
                                <span>Zero Learning Curve</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-[2px] w-8 bg-foreground" />
                                <span>100% Focus</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Geometric accent */}
            <div className="absolute right-0 bottom-0 left-0 h-px bg-foreground" />
        </section>
    );
};
