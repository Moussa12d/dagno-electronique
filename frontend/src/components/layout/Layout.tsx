import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "../ui/WhatsAppButton";

export function Layout() {
  const { pathname } = useLocation();
  const showWhatsApp = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-dagno-bg">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showWhatsApp && <WhatsAppButton />}
    </div>
  );
}