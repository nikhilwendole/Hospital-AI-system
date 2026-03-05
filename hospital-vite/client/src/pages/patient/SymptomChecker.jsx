import { useState, useRef, useEffect } from "react"
import { checkSymptoms } from "../../utils/api"
import { Link } from "react-router-dom"

export default function SymptomChecker() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your AI health assistant 🤖\n\nDescribe your symptoms and I'll help recommend the right department to visit. Remember — I'm an AI and not a substitute for professional medical advice." }
  ])
  const [input, setInput]     = useState("")
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [suggestedDept, setSuggestedDept] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const msg = input.trim(); setInput("")
    setMessages(p => [...p, { role:"user", text:msg }])
    setLoading(true)
    try {
      const { data } = await checkSymptoms({ symptoms: msg, conversationHistory: history })
      setMessages(p => [...p, { role:"assistant", text: data.reply }])
      setHistory(data.updatedHistory)
      const depts = ["General Medicine","Cardiology","Orthopedics","Neurology","Pediatrics","Dermatology","ENT","Ophthalmology","Psychiatry","Gynecology"]
      const found = depts.find(d => data.reply.includes(d))
      if (found) setSuggestedDept(found)
    } catch (err) {
      setMessages(p => [...p, { role:"assistant", text:"Sorry, I encountered an error. Please try again." }])
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 fade-in">
      <div className="mb-6">
        <h1 className="page-title">🤖 AI Symptom Checker</h1>
        <p className="text-slate-500">Powered by Groq · Llama 3</p>
      </div>

      {/* Chat Box */}
      <div className="card p-0 overflow-hidden flex flex-col" style={{ height: "520px" }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role==="user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${msg.role==="user" ? "bg-blue-500" : "bg-slate-100"}`}>
                {msg.role==="user" ? "👤" : "🤖"}
              </div>
              <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role==="user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-800 rounded-tl-sm"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">🤖</div>
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1 items-center h-5">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}}/>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}}/>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}}/>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-100 p-4 flex gap-3">
          <input className="input-field flex-1" value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="e.g. I have chest pain and shortness of breath..." />
          <button onClick={send} disabled={loading || !input.trim()}
            className="btn-primary px-5 disabled:opacity-50">Send</button>
        </div>
      </div>

      {/* Suggestion */}
      {suggestedDept && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-emerald-800">✅ Recommended: <strong>{suggestedDept}</strong></p>
              <p className="text-emerald-600 text-sm mt-1">Book an appointment with a specialist</p>
            </div>
            <Link to="/patient/book" className="btn-success text-sm">Book Now →</Link>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs">
        ⚠️ <strong>Disclaimer:</strong> This AI is for guidance only. Always consult a qualified doctor for diagnosis and treatment.
      </div>
    </div>
  )
}
