import { useEffect, useRef, useState } from "react";
import { PIcon } from "@/components/icons/PIcon";

type ChatRole = "user" | "assistant";

interface ChatTurn {
  role: ChatRole;
  content: string;
}

interface ChatApiResponse {
  reply: string;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const loadingPhrases: string[] = [
    "Думаю, как лучше рассказать о кандидате…",
    "Собираю факты по резюме Александра…",
    "Проверяю проекты и стек, чтобы ответ был по делу…",
    "Смотрю, чем можно зацепить тимлида…",
    "Подбираю формулировки без лишней воды…",
    "Сравниваю опыт с типичными задачами в продакшене…",
    "Аккуратно формирую ответ для работодателя…",
    "Собираю краткое, но ёмкое описание…",
    "Сфокусировался на сильных сторонах и кейсах…",
    "Думаю, как ответить так, чтобы захотелось созвониться…",
  ];

  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove("chat-open");
      return;
    }
    document.body.classList.add("chat-open");
    return () => {
      document.body.classList.remove("chat-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingIndex(0);
      return;
    }

    const id = window.setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 1400);

    return () => {
      window.clearInterval(id);
    };
  }, [isLoading, loadingPhrases.length]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history.length, isLoading, isOpen]);

  const handleSend = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setError("");

    const nextHistory: ChatTurn[] = [...history, { role: "user", content: text }];
    const truncated = nextHistory.slice(-40);
    setHistory(truncated);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: truncated }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = (await response.json()) as ChatApiResponse;
      const reply = data.reply?.trim() || "";
      if (!reply) {
        return;
      }

      setHistory((prev: ChatTurn[]) => {
        const updated: ChatTurn[] = [...prev, { role: "assistant", content: reply }];
        return updated.slice(-40);
      });
    } catch {
      setError("Не удалось получить ответ. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return isOpen ? (
    <div className="chat-modal" role="dialog" aria-modal="true" aria-label="Чат с нейросетью">
      <div className="chat-modal__overlay" onClick={onClose}></div>
      <div className="chat-modal__panel">
        <div className="chat-modal__header">
          <div className="chat-modal__title">
            <PIcon name="chat" />
            <span>Чат с нейросетью</span>
          </div>
          <button className="chat-modal__close" type="button" onClick={onClose}>
            Закрыть
          </button>
        </div>

            <div className="chat-modal__body">
              <div className="chat-modal__messages">
                {history.length === 0 ? (
                  <div className="chat-placeholder">
                    <div className="chat-placeholder__icon">
                      <PIcon name="chat" />
                    </div>
                    <p className="chat-placeholder__text">
                      Здесь можно задать вопрос про резюме Александра: опыт, проекты, стек или сильные стороны.
                    </p>
                  </div>
                ) : (
                  history.map((turn, idx) => (
                    <div key={idx} className={`chat-message chat-message--${turn.role}`}>
                      <div className="chat-message__bubble">{turn.content}</div>
                    </div>
                  ))
                )}
                {isLoading ? (
                  <div className="chat-loading">
                    <div className="chat-loading__typing" aria-hidden="true">
                      <span className="chat-placeholder__dot"></span>
                      <span className="chat-placeholder__dot"></span>
                      <span className="chat-placeholder__dot"></span>
                    </div>
                    <p className="chat-loading__text">{loadingPhrases[loadingIndex]}</p>
                  </div>
                ) : null}
                {error ? <p className="chat-modal__error">{error}</p> : null}
                <div ref={messagesEndRef} aria-hidden="true" />
              </div>
            </div>

            <form className="chat-modal__footer" onSubmit={handleSend}>
              <input
                className="chat-modal__input"
                type="text"
                placeholder="Написать сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button className="chat-modal__send" type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? "Думаю..." : "Отправить"}
              </button>
            </form>
          </div>
        </div>
  ) : null;
}

