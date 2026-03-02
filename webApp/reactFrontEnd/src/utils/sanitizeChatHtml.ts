import DOMPurify from "dompurify";

/** Разрешённые теги для ответов нейросети в чате (защита от XSS). */
const ALLOWED_TAGS = ["p", "ul", "ol", "li", "strong", "b", "em", "br", "a"];

const ALLOWED_ATTR: string[] = ["href"];

/**
 * Санитизирует HTML для безопасного вывода в чате.
 * Убирает script, event-атрибуты, javascript: и т.п.
 */
export function sanitizeChatHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: [],
  });
}

/**
 * Экранирует строку для безопасного вывода как текст (защита от XSS в сообщениях пользователя).
 */
export function escapeChatText(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
