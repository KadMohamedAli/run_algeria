export function fieldClassName() {
  return "w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20";
}

export function textareaClassName() {
  return `${fieldClassName()} min-h-[120px] resize-y`;
}

export function Section({ title, description, children }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function LabeledField({ label, hint, children }) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-medium text-slate-100">{label}</span>
      {hint ? <span className="block text-xs text-slate-400">{hint}</span> : null}
      {children}
    </label>
  );
}

export function ColorSwatch({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span
          className="h-10 w-10 rounded-full border border-white/15"
          style={{ backgroundColor: value }}
        />
        <span className="font-mono text-sm text-white">{value}</span>
      </div>
    </div>
  );
}

export function StatusMessage({ status }) {
  if (!status.message) return null;

  return (
    <p
      className={`mt-4 text-sm ${
        status.type === "success"
          ? "text-emerald-300"
          : status.type === "error"
            ? "text-rose-300"
            : "text-slate-300"
      }`}
    >
      {status.message}
    </p>
  );
}
