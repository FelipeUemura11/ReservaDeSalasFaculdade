import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout() {
    return (
        <div className="isolate flex min-h-screen flex-col bg-primary text-gray-800">
            <Header />
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
