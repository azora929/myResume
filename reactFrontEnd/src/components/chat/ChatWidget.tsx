import { useEffect, useState } from "react";
import { PIcon } from "@/components/icons/PIcon";

type ChatRole = "user" | "assistant";

interface ChatTurn {
  role: ChatRole;
  content: string;
}

interface ChatApiResponse {
  reply: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

      setHistory((prev) => {
        const updated = [...prev, { role: "assistant", content: reply }];
        return updated.slice(-40);
      });
    } catch {
      setError("Не удалось получить ответ. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="chat-fab" type="button" onClick={() => setIsOpen(true)} aria-label="Открыть чат">
        <PIcon name="chat" />
      </button>

      {isOpen ? (
        <div className="chat-modal" role="dialog" aria-modal="true" aria-label="Чат с нейросетью">
          <div className="chat-modal__overlay" onClick={() => setIsOpen(false)}></div>
          <div className="chat-modal__panel">
            <div className="chat-modal__header">
              <div className="chat-modal__title">
                <PIcon name="chat" />
                <span>Чат с нейросетью</span>
              </div>
              <button className="chat-modal__close" type="button" onClick={() => setIsOpen(false)}>
                Закрыть
              </button>
            </div>

            <div className="chat-modal__body">
              <div className="chat-modal__messages">
                {history.length === 0 ? (
                  <p className="chat-modal__note">
                    Здесь можно задать вопрос про резюме Александра. Чат использует историю диалога и продаёт кандидата
                    работодателю.
                  </p>
                ) : (
                  history.map((turn, idx) => (
                    <div key={idx} className={`chat-message chat-message--${turn.role}`}>
                      <div className="chat-message__bubble">{turn.content}</div>
                    </div>
                  ))
                )}
                {error ? <p className="chat-modal__error">{error}</p> : null}
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
      ) : null}
    </>
  );
}

