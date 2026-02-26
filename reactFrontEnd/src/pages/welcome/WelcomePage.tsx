import { WelcomeMessage } from "@/components/welcome/WelcomeMessage";
import "@/styles/welcome/welcome.scss";

export function WelcomePage() {
  return (
    <main className="welcome-page">
      <WelcomeMessage />
    </main>
  );
}
