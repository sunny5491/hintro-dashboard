import { useState } from 'react';
import { X, Star, Send, MessageSquare, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface FeedbackEntry {
  rating: number;
  text: string;
  timestamp: string;
}

const STORAGE_KEY = 'hintro_feedback';

const loadFeedback = (): FeedbackEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveFeedback = (entries: FeedbackEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal = ({ isOpen, onClose }: Props) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [past, setPast] = useState<FeedbackEntry[]>(loadFeedback);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !text.trim()) return;
    const entry: FeedbackEntry = {
      rating,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    const updated = [entry, ...past];
    saveFeedback(updated);
    setPast(updated);
    setSubmitted(true);
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setText('');
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/15 flex items-center justify-center">
              <MessageSquare size={16} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Share Feedback</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--color-success)]/15 flex items-center justify-center">
                <CheckCircle size={28} className="text-[var(--color-success)]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text)]">Thank you!</h3>
                <p className="text-sm text-[var(--color-muted)] mt-1">Your feedback has been saved.</p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                Leave another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star rating */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  How would you rate your experience?
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                      aria-label={`${star} stars`}
                    >
                      <Star
                        size={28}
                        className={clsx(
                          'transition-colors',
                          (hoverRating || rating) >= star
                            ? 'text-[var(--color-warning)] fill-[var(--color-warning)]'
                            : 'text-[var(--color-border)]'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Tell us more
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's working well? What could be improved?"
                  rows={4}
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!rating || !text.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-lg shadow-indigo-900/30"
              >
                <Send size={15} />
                Submit Feedback
              </button>
            </form>
          )}

          {/* Past feedback */}
          {past.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
              <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
                Past Responses ({past.length})
              </h3>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                {past.map((entry, i) => (
                  <div key={i} className="bg-[var(--color-bg)] rounded-xl p-3">
                    <div className="flex items-center gap-1 mb-1.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          size={12}
                          className={clsx(
                            s < entry.rating
                              ? 'text-[var(--color-warning)] fill-[var(--color-warning)]'
                              : 'text-[var(--color-border)]'
                          )}
                        />
                      ))}
                      <span className="text-xs text-[var(--color-muted)] ml-auto">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-muted)] line-clamp-2">{entry.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
