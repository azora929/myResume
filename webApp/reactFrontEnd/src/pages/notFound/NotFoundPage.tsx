import { Link } from "react-router-dom";
import { NotFoundGraphic } from "@/components/notFound/NotFoundGraphic";
import "@/styles/notFound/notFound.scss";

export function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <NotFoundGraphic />
        <h1 className="not-found__title">Где страница? Нет страницы!</h1>
        <p className="not-found__subtitle">Но зато у нас есть другие!</p>
        <Link to="/" className="not-found__cta">
          Перейти на рабочую страницу
        </Link>
      </div>
    </div>
  );
}
