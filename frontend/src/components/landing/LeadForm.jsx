import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { problems, profile } from "@/data/profile";

// Free form-to-email relay (formsubmit.co). Leads arrive in the inbox below.
// The very first submission triggers a one-time activation email to that address.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${profile.email}`;
const EASE = [0.215, 0.61, 0.355, 1];

const Field = ({ id, label, compact, ...props }) => (
  <label className="block">
    <span className={`block font-mono uppercase tracking-[0.08em] text-[#5F5E5A] mb-1.5 ${compact ? "text-[0.55rem]" : "text-[0.62rem]"}`}>{label}</span>
    <input
      id={id}
      data-testid={`${id}-input`}
      className={`w-full bg-white border border-[#D3D1C7] focus:border-[#0F6E56] rounded-xl outline-none transition-colors text-[#042C53] ${
        compact ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm md:text-base"
      }`}
      {...props}
    />
  </label>
);

export const LeadForm = ({ source = "booking", compact = false, onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", interest: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const prefix = source === "chat" ? "chat-lead" : "booking";

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (e.currentTarget.elements._honey?.value) return; // bot trap
    setStatus("loading");
    setError("");
    try {
      const fields = Object.fromEntries(Object.entries(form).filter(([, v]) => v.trim() !== ""));
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...fields,
          _subject: `New website enquiry from ${form.name}`,
          _replyto: form.email,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === "false") throw new Error(data.message || "send failed");
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("idle");
      setError(`Could not send your request. Please email ${profile.email} directly.`);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="ok"
          data-testid={`${prefix}-success`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className={`rounded-2xl bg-[#E1F5EE] text-[#04342C] ${compact ? "p-4" : "p-8"}`}
        >
          <CheckCircle2 className="text-[#0F6E56]" size={compact ? 22 : 32} />
          <p className={`mt-3 font-serif font-semibold text-[#042C53] ${compact ? "text-lg" : "text-2xl"}`}>Request received.</p>
          <p className={`mt-2 leading-relaxed ${compact ? "text-sm" : "text-base"}`}>
            Thank you, {form.name.split(" ")[0]}. I will reply to {form.email} to set up our 20-minute call.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          data-testid={`${prefix}-form`}
          onSubmit={submit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={compact ? "space-y-3" : "space-y-5"}
        >
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className={`grid gap-${compact ? "3" : "5"} ${compact ? "" : "sm:grid-cols-2"}`}>
            <Field id={`${prefix}-name`} label="Name" compact={compact} required minLength={2} value={form.name} onChange={set("name")} placeholder="Your name" />
            <Field id={`${prefix}-email`} label="Email" compact={compact} type="email" required value={form.email} onChange={set("email")} placeholder="you@company.com" />
          </div>
          {!compact && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`${prefix}-phone`} label="Phone / WhatsApp (optional)" value={form.phone} onChange={set("phone")} placeholder="+971 …" />
              <Field id={`${prefix}-company`} label="Company (optional)" value={form.company} onChange={set("company")} placeholder="Company name" />
            </div>
          )}
          <label className="block">
            <span className={`block font-mono uppercase tracking-[0.08em] text-[#5F5E5A] mb-1.5 ${compact ? "text-[0.55rem]" : "text-[0.62rem]"}`}>What would you like to talk about?</span>
            <select
              data-testid={`${prefix}-interest-select`}
              value={form.interest}
              onChange={set("interest")}
              className={`w-full bg-white border border-[#D3D1C7] focus:border-[#0F6E56] rounded-xl outline-none transition-colors text-[#042C53] ${
                compact ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm md:text-base"
              }`}
            >
              <option value="">Not sure yet, let's talk</option>
              {problems.map((p) => (
                <option key={p.tag} value={p.tag}>{p.tag}</option>
              ))}
            </select>
          </label>
          {!compact && (
            <label className="block">
              <span className="block font-mono text-[0.62rem] uppercase tracking-[0.08em] text-[#5F5E5A] mb-1.5">Anything I should know first? (optional)</span>
              <textarea
                data-testid={`${prefix}-message-input`}
                rows={4}
                maxLength={2000}
                value={form.message}
                onChange={set("message")}
                placeholder="Which numbers you rely on, and where an error would hurt."
                className="w-full bg-white border border-[#D3D1C7] focus:border-[#0F6E56] rounded-xl px-4 py-3 text-sm md:text-base outline-none transition-colors text-[#042C53] resize-none"
              />
            </label>
          )}
          {error && (
            <p data-testid={`${prefix}-error`} className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            data-testid={`${prefix}-submit-button`}
            disabled={status === "loading"}
            className={`btn-pill btn-navy disabled:opacity-60 ${compact ? "!py-2.5 !px-4 text-xs w-full justify-center" : ""}`}
          >
            {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : null}
            {status === "loading" ? "Sending…" : "Request the free 20-minute conversation"}
            {status !== "loading" && <ArrowUpRight size={16} />}
          </button>
          {!compact && (
            <p className="text-xs text-[#5F5E5A] leading-relaxed">
              No commitment. Your details come straight to me and are never shared.
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
};
