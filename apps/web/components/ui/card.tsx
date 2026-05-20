export function Card({ children }: { children: React.ReactNode }) { return <div className="rounded-xl border p-4 bg-white shadow-sm">{children}</div>; }
export function CardTitle({ children }: { children: React.ReactNode }) { return <h3 className="font-semibold text-sm text-slate-700 mb-2">{children}</h3>; }
