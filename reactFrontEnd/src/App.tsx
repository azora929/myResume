import { Routes, Route } from "react-router-dom";
import { NotFoundPage } from "@/pages/notFound/NotFoundPage";
import { WelcomePage } from "@/pages/welcome/WelcomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
