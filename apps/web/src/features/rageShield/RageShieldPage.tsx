import { type FormEvent, useState } from 'react';
import {
  analyzeRageShield,
  type RageShieldAnalysis,
  type RageShieldConversationMessage,
} from './rageShieldService';

type ChatMessage =
  | { id: string; role: 'user'; content: string }
  | { id: string; role: 'assistant'; content: string; analysis?: RageShieldAnalysis };

const levelCopy: Record<RageShieldAnalysis['riskLevel'], string> = {
  many_signals: 'Có nhiều dấu hiệu cần xem xét',
  some_signals: 'Có một số dấu hiệu cần xem xét',
  insufficient_information: 'Chưa đủ thông tin để đánh giá',
  no_clear_signals: 'Chưa thấy dấu hiệu rõ ràng',
  information_concerns: 'Cần kiểm chứng thông tin',
};

const greeting: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Bạn có thể dán một bài viết, tiêu đề hoặc bình luận. Tôi sẽ chỉ ra dấu hiệu có thể quan sát được, điều cần kiểm chứng và các lựa chọn phản hồi an toàn.',
};

export function RageShieldPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [content, setContent] = useState('');
  const [draftReply, setDraftReply] = useState('');
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = content.trim();
    if (!message || !consented || isLoading) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: message };
    const conversation: RageShieldConversationMessage[] = messages
      .slice(-6)
      .filter((item) => item.id !== 'welcome')
      .map((item) => ({ role: item.role, content: item.content }));
    setMessages((current) => [...current, userMessage]);
    setContent('');
    setError(undefined);
    setIsLoading(true);

    try {
      const analysis = await analyzeRageShield(message, draftReply, conversation);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: analysis.summary, analysis },
      ]);
      setDraftReply('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể phản hồi lúc này.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-page">
      <section className="chat-hero"><div className="wrap"><p className="kicker">RAGE SHIELD AI</p><h1>Hỏi trước khi phản hồi.</h1><p>Trao đổi về một nội dung gây tranh cãi mà không vội gắn nhãn hoặc lan truyền thêm.</p></div></section>
      <main className="chat-layout wrap">
        <section className="chat-panel" aria-label="Cuộc trò chuyện với Rage Shield">
          <div className="chat-messages" aria-live="polite">
            {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
            {isLoading && <div className="chat-bubble assistant typing" aria-label="Rage Shield đang soạn phản hồi"><span /><span /><span /></div>}
          </div>
          <form className="chat-composer" onSubmit={(event) => void submit(event)}>
            <label htmlFor="chat-content">Nội dung hoặc câu hỏi của bạn</label>
            <textarea id="chat-content" value={content} onChange={(event) => setContent(event.target.value)} maxLength={6000} placeholder="Dán nội dung cần phân tích hoặc hỏi tiếp về kết quả..." required />
            <details><summary>Thêm bình luận cần viết lại</summary><label htmlFor="draft-reply">Bình luận dự định gửi</label><textarea id="draft-reply" value={draftReply} onChange={(event) => setDraftReply(event.target.value)} maxLength={2000} placeholder="AI sẽ gợi ý một cách diễn đạt bình tĩnh hơn." /></details>
            <div className="composer-footer"><label className="consent" htmlFor="privacy-consent"><input id="privacy-consent" type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} /><span>Tôi không gửi thông tin cá nhân hoặc tin nhắn riêng tư.</span></label><button className="button dark" type="submit" disabled={!content.trim() || !consented || isLoading}>{isLoading ? 'Đang trả lời...' : 'Gửi tin nhắn'}</button></div>
            {error && <p className="form-error" role="alert">{error}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'user') return <article className="chat-bubble user"><p>{message.content}</p></article>;
  const { analysis } = message;
  return <article className="chat-bubble assistant"><p className="assistant-name">Rage Shield AI</p>{analysis ? <AnalysisReply analysis={analysis} /> : <p>{message.content}</p>}</article>;
}

function AnalysisReply({ analysis }: { analysis: RageShieldAnalysis }) {
  return <div className="chat-analysis"><h2>{levelCopy[analysis.riskLevel]}</h2><p>{analysis.summary}</p><div className="chat-pause"><b>Dừng lại một chút</b><span>{analysis.pausePrompt}</span></div>{analysis.signals.length > 0 && <section><h3>Dấu hiệu quan sát được</h3>{analysis.signals.map((signal) => <article className="chat-signal" key={`${signal.type}-${signal.evidence}`}><b>{signal.type}</b><p><strong>Chi tiết:</strong> {signal.evidence}</p><p>{signal.explanation}</p><p><strong>Cách hiểu khác:</strong> {signal.alternativeExplanation}</p><small>Giới hạn: {signal.limitation}</small></article>)}</section>}<div className="chat-action-grid"><List title="Kiểm chứng trước khi tin" items={analysis.verificationSteps} /><List title="Hành động phù hợp" items={analysis.recommendedActions} /></div>{analysis.replySuggestion && <section className="chat-reply"><h3>Gợi ý viết lại bình luận</h3><p>{analysis.replySuggestion}</p></section>}<section className="chat-limits"><h3>Điều AI chưa thể kết luận</h3><ul>{analysis.limitations.map((item) => <li key={item}>{item}</li>)}</ul></section></div>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return <section><h3>{title}</h3><ol>{items.map((item) => <li key={item}>{item}</li>)}</ol></section>;
}
