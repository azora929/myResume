import { Routes, Route } from "react-router-dom";
import { MainPage } from "@/pages/main/MainPage";
import { NotFoundPage } from "@/pages/notFound/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
