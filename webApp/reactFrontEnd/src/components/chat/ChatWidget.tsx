import { useCallback, useEffect, useRef, useState } from "react";
import { PIcon } from "@/components/icons/PIcon";
import { sanitizeChatHtml } from "@/utils/sanitizeChatHtml";
import "./ChatWidget.scss";

type ChatRole = "user" | "assistant";

interface ChatTurn {
  role: ChatRole;
  content: string;
  isStreaming?: boolean;
}

type ConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting" | "failed";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const WS_PATH = "/api/ws/chat";
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000];
const MAX_RECONNECT_ATTEMPTS = 5;

const loadingPhrases = [
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

function getWsUrl(): string {
  if (typeof window === "undefined") return "";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}${WS_PATH}`;
}

export function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatOpenRef = useRef(false);
  const reconnectAttemptRef = useRef(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    const url = getWsUrl();
    if (!url) return;
    setConnectionStatus("connecting");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("connected");
      setReconnectAttempt(0);
      reconnectAttemptRef.current = 0;
      setError("");
    };

    ws.onclose = () => {
      wsRef.current = null;
      setRoomId(null);
      if (!chatOpenRef.current) {
        setConnectionStatus("idle");
        return;
      }
      reconnectAttemptRef.current += 1;
      const attempt = reconnectAttemptRef.current;
      setReconnectAttempt(attempt);
      if (attempt < MAX_RECONNECT_ATTEMPTS) {
        setConnectionStatus("reconnecting");
        const delay = RECONNECT_DELAYS[Math.min(attempt - 1, RECONNECT_DELAYS.length - 1)];
        reconnectTimeoutRef.current = setTimeout(() => connect(), delay);
      } else {
        setConnectionStatus("failed");
        setError("Не удалось подключиться. Закройте чат и откройте снова.");
      }
    };

    ws.onerror = () => {
      setConnectionStatus(ws.readyState === WebSocket.OPEN ? "connected" : "reconnecting");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);
        const type = data.type;
        if (type === "connected") {
          setRoomId(data.room_id ?? null);
          return;
        }
        if (type === "chunk") {
          const text = data.text ?? "";
          setHistory((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant" && last?.isStreaming) {
              next[next.length - 1] = { ...last, content: last.content + text };
              return next;
            }
            next.push({ role: "assistant", content: text, isStreaming: true });
            return next;
          });
        } else if (type === "done") {
          setHistory((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant" && last?.isStreaming) {
              next[next.length - 1] = { ...last, isStreaming: false };
              return next;
            }
            return next;
          });
          setIsLoading(false);
        } else if (type === "error") {
          setHistory((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && last?.isStreaming) {
              return prev.slice(0, -1);
            }
            return prev;
          });
          setError("Не удалось получить ответ. Повторите попытку, пожалуйста.");
          setIsLoading(false);
        }
      } catch {
        setError("Ошибка формата ответа");
        setIsLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      chatOpenRef.current = false;
      document.body.classList.remove("chat-open");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setConnectionStatus("idle");
      setReconnectAttempt(0);
      reconnectAttemptRef.current = 0;
      return;
    }
    chatOpenRef.current = true;
    document.body.classList.add("chat-open");
    connect();
    return () => {
      chatOpenRef.current = false;
      document.body.classList.remove("chat-open");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isOpen, connect]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 1400);
    return () => window.clearInterval(id);
  }, [isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history.length, history[history.length - 1]?.content?.length, isLoading, isOpen]);

  const handleSend = (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    if (connectionStatus !== "connected" || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError("Нет соединения. Подождите переподключения.");
      return;
    }

    setError("");
    const nextHistory: ChatTurn[] = [...history, { role: "user", content: text }];
    const truncated = nextHistory.slice(-40);
    setHistory(truncated);
    setInput("");
    setIsLoading(true);

    const payload: Record<string, unknown> = {
      type: "message",
      history: truncated.slice(0, -1).map((t) => ({ role: t.role, content: t.content })),
      text,
    };
    if (roomId) payload.room_id = roomId;
    wsRef.current.send(JSON.stringify(payload));
  };

  const isBlocked =
    connectionStatus === "connecting" ||
    connectionStatus === "reconnecting" ||
    connectionStatus === "failed";

  return isOpen ? (
    <div className="chat-modal" role="dialog" aria-modal="true" aria-label="Чат с нейросетью">
      <div className="chat-modal__overlay" onClick={onClose} />
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
            {connectionStatus === "reconnecting" || connectionStatus === "connecting" ? (
              <div className="chat-reconnect">
                <div className="chat-reconnect__spinner" aria-hidden />
                <p className="chat-reconnect__text">
                  {connectionStatus === "reconnecting" ? "Переподключение…" : "Подключение…"}
                </p>
                <p className="chat-reconnect__hint">
                  Подождите, чат временно недоступен.
                  {reconnectAttempt > 0 && ` (попытка ${reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS})`}
                </p>
              </div>
            ) : null}
            {connectionStatus === "failed" ? (
              <div className="chat-reconnect chat-reconnect--failed">
                <p className="chat-reconnect__text">Не удалось подключиться</p>
                <p className="chat-reconnect__hint">Закройте чат и откройте снова или обновите страницу.</p>
              </div>
            ) : null}
            {!isBlocked && history.length === 0 ? (
              <div className="chat-placeholder">
                <div className="chat-placeholder__icon">
                  <PIcon name="chat" />
                </div>
                <p className="chat-placeholder__text">
                  Здесь можно задать вопрос про резюме Александра: опыт, проекты, стек или сильные стороны.
                </p>
              </div>
            ) : null}
            {history.length > 0
              ? history.map((turn, idx) => (
                  <div key={idx} className={`chat-message chat-message--${turn.role}`}>
                    {turn.role === "assistant" ? (
                      <div
                        className="chat-message__bubble"
                        dangerouslySetInnerHTML={
                          turn.isStreaming
                            ? undefined
                            : { __html: sanitizeChatHtml(turn.content) }
                        }
                      >
                        {turn.isStreaming ? turn.content : null}
                      </div>
                    ) : (
                      <div className="chat-message__bubble">{turn.content}</div>
                    )}
                  </div>
                ))
              : null}
            {isLoading && !(history.length > 0 && history[history.length - 1]?.role === "assistant" && history[history.length - 1]?.isStreaming) ? (
              <div className="chat-loading">
                <div className="chat-loading__typing" aria-hidden="true">
                  <span className="chat-placeholder__dot" />
                  <span className="chat-placeholder__dot" />
                  <span className="chat-placeholder__dot" />
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
            placeholder={
              isBlocked ? "Подключение…" : "Написать сообщение..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isBlocked}
          />
          <button
            className="chat-modal__send"
            type="submit"
            disabled={isLoading || isBlocked || !input.trim()}
          >
            {isLoading ? "Думаю…" : "Отправить"}
          </button>
        </form>
      </div>
    </div>
  ) : null;
}
