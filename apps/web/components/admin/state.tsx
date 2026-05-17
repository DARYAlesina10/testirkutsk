export function LoadingState(){return <div className="animate-pulse text-slate-500">Загрузка...</div>}
export function ErrorState({msg}:{msg:string}){return <div className="text-red-600 border border-red-200 p-3 rounded">{msg}</div>}
export function EmptyState({msg}:{msg:string}){return <div className="text-slate-500 border border-dashed p-3 rounded">{msg}</div>}
