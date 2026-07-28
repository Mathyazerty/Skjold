export default function FaqItem({ question, answer }) {
  return (
    <details className="group bg-surface-container-low rounded-lg">
      <summary className="flex justify-between items-center p-md cursor-pointer font-label-bold text-label-bold text-on-surface">
        {question}
        <span className="material-symbols-outlined transition-transform group-open:rotate-180">
          expand_more
        </span>
      </summary>
      <div className="px-md pb-md font-body-md text-body-md text-secondary">
        {answer}
      </div>
    </details>
  );
}
