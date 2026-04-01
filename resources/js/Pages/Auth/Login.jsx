import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* LEFT */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start lg:hidden">
                    <div class="flex items-center gap-4">
                        <div class="leading-tight ">
                            <h1 class="text-3xl md:text-4xl font-extrabold tracking-wide text-gray-900">
                                BHAIRAHAWA
                            </h1>
                            <p class="text-xl md:text-2xl font-semibold tracking-widest text-gray-600 uppercase">
                                EYE CARE
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative hidden bg-white lg:block">
                <img
                    src="/assets/logo.png"
                    alt="Logo"
                    className="absolute inset-0 w-full h-full object-contain p-10"
                />
            </div>
        </div>
    );
}
