import { useState } from 'react';

interface ReadMoreProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export default function ReadMore({ text, maxLength = 110, className }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);
  if (!text || text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }
  return (
    <span className={className}>
      {expanded ? text : text.slice(0, maxLength) + '...'}{' '}
      <button
        type="button"
        className="inline text-blue-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded transition px-1"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? 'Скрыть' : 'Читать полностью'}
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </span>
  );
}
