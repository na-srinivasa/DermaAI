import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowRight, BrainCircuit, CheckCircle2, ChevronDown,
  CircleAlert, FileImage, FlaskConical, Gauge, HeartPulse, Languages,
  LockKeyhole, Microscope, RefreshCw, ScanLine, ShieldCheck,
  Sparkles, Stethoscope, UploadCloud, X, Zap
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { askGemini, getExplanation, healthCheck, predictImage } from "./api";
import type { PredictionResult } from "./types";

const CLASS_LABELS: Record<string, string> = {
  akiec: "Actinic Keratoses",
  bcc: "Basal Cell Carcinoma",
  bkl: "Benign Keratosis-like Lesions",
  df: "Dermatofibroma",
  mel: "Melanoma",
  nv: "Melanocytic Nevi",
  vasc: "Vascular Lesions",
};

const DATASET = [
  ["nv", 6705], ["mel", 1113], ["bkl", 1099], ["bcc", 514],
  ["akiec", 327], ["vasc", 142], ["df", 115]
];

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [explanation, setExplanation] = useState("");
  const [language, setLanguage] = useState("English");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [explainBusy, setExplainBusy] = useState(false);
  const [askBusy, setAskBusy] = useState(false);
  const [error, setError] = useState("");
  const [backendOnline, setBackendOnline] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    healthCheck().then(setBackendOnline);
  }, []);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const chartData = useMemo(() => {
    if (!prediction) return [];
    return Object.entries(prediction.probabilities)
      .map(([key, value]) => ({ name: CLASS_LABELS[key] || key, value: +(value * 100).toFixed(2) }))
      .sort((a, b) => b.value - a.value);
  }, [prediction]);

  function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    setPrediction(null);
    setExplanation("");
    setAnswer("");
    if (!next.type.startsWith("image/") || !["image/jpeg", "image/png"].includes(next.type)) {
      setError("Please upload a JPG, JPEG, or PNG image.");
      return;
    }
    if (next.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }

  async function analyze() {
    if (!file) return;
    setBusy(true); setError(""); setPrediction(null); setExplanation(""); setAnswer("");
    try {
      const result = await predictImage(file);
      setPrediction(result);
      setExplainBusy(true);
      try {
        const resultExplanation = await getExplanation(result, language);
        setExplanation(resultExplanation.explanation);
      } catch {
        setExplanation("Educational explanation is currently unavailable. The prediction and probability profile are still available for review.");
      } finally {
        setExplainBusy(false);
      }
    } catch (e) {
      setError("Unable to analyze the image. Make sure the FastAPI backend is running on port 8000.");
    } finally {
      setBusy(false);
    }
  }

  async function ask() {
    if (!prediction || !question.trim()) return;
    setAskBusy(true); setError(""); setAnswer("");
    try {
      const result = await askGemini(prediction, language, question.trim());
      setAnswer(result.answer);
    } catch {
      setError("The educational assistant is unavailable right now. You can still review the prediction and explanation.");
    } finally {
      setAskBusy(false);
    }
  }

  function reset() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(""); setPrediction(null); setExplanation(""); setAnswer(""); setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-mark"><ScanLine size={19} /></span>
          <span>DERMA<span>AI</span></span>
        </a>
        <nav>
          <a href="#analyzer">Analyzer</a>
          <a href="#insights">Insights</a>
          <a href="#safety">Safety</a>
        </nav>
        <div className="status-pill">
          <span className={backendOnline ? "status-dot online" : "status-dot"} />
          {backendOnline ? "AI engine online" : "Connect backend"}
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={14} /> INTELLIGENT DERMATOLOGY RESEARCH</div>
            <h1>See the skin.<br /><em>Understand</em> the signal.</h1>
            <p className="hero-sub">
              An AI-powered educational workspace for exploring skin-lesion image classifications,
              model confidence, and clinically relevant context.
            </p>
            <div className="hero-actions">
              <a href="#analyzer" className="primary-btn">Start analysis <ArrowRight size={17} /></a>
              <div className="hero-trust"><ShieldCheck size={17} /> Educational · Non-diagnostic</div>
            </div>
            <div className="hero-metrics">
              <div><strong>7</strong><span>categories</span></div>
              <div><strong>300²</strong><span>image input</span></div>
              <div><strong>AI</strong><span>+ education</span></div>
            </div>
          </div>

          <div className="hero-orbit">
            <div className="orbit-ring ring-1" />
            <div className="orbit-ring ring-2" />
            <div className="orbit-ring ring-3" />
            <div className="scan-core">
              <div className="core-grid" />
              <div className="core-glow" />
              <ScanLine size={58} strokeWidth={1.2} />
              <span>DERMA<br /><b>CORE</b></span>
            </div>
            <div className="float-card fc-a"><Activity size={15} /><span>Pattern engine</span><b>READY</b></div>
            <div className="float-card fc-b"><Gauge size={15} /><span>Confidence</span><b>{prediction ? `${prediction.confidence_percent.toFixed(1)}%` : "—"}</b></div>
          </div>
        </section>

        <section id="analyzer" className="section analyzer-section">
          <div className="section-heading">
            <div><span className="section-kicker">01 / ANALYZER</span><h2>Upload & analyze</h2></div>
            <span className="muted">JPG · JPEG · PNG · max 10 MB</span>
          </div>

          <div className="workspace">
            <div className="upload-panel glass">
              {!preview ? (
                <div
                  className={`dropzone ${dragging ? "dragging" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); selectFile(e.dataTransfer.files?.[0]); }}
                  onClick={() => inputRef.current?.click()}
                >
                  <input ref={inputRef} type="file" accept="image/jpeg,image/png" hidden
                    onChange={(e) => selectFile(e.target.files?.[0])} />
                  <div className="upload-icon"><UploadCloud size={27} /></div>
                  <h3>Drop lesion image here</h3>
                  <p>or click to browse from your device</p>
                  <span className="upload-note"><LockKeyhole size={12} /> Processed through your local API</span>
                </div>
              ) : (
                <div className="preview-wrap">
                  <img src={preview} alt="Selected skin lesion" />
                  <button className="remove-btn" onClick={reset} aria-label="Remove image"><X size={17} /></button>
                  <div className="preview-tag"><FileImage size={13} /> {file?.name}</div>
                </div>
              )}
              {preview && (
                <button className="analyze-btn" onClick={analyze} disabled={busy}>
                  {busy ? <><span className="spinner" /> Running neural analysis…</> : <><Zap size={17} /> Analyze image</>}
                </button>
              )}
            </div>

            <div className="process-panel">
              <div className="process-title"><span>ANALYSIS PIPELINE</span><span>LIVE</span></div>
              {[
                [FileImage, "Image intake", "RGB · 300 × 300"],
                [BrainCircuit, "Neural inference", "EfficientNetB3"],
                [Gauge, "Confidence profile", "7 class probabilities"],
                [Sparkles, "Educational layer", "Gemini context"]
              ].map(([Icon, title, sub], i) => {
                const I = Icon as typeof FileImage;
                return <div className={`process-step ${busy && i === 1 ? "active" : ""}`} key={title as string}>
                  <div className="step-number">0{i + 1}</div><I size={17} />
                  <div><b>{title}</b><small>{sub}</small></div><CheckCircle2 size={15} />
                </div>
              })}
            </div>
          </div>

          {error && <div className="error-box"><CircleAlert size={17} /> {error}</div>}
        </section>

        {prediction && (
          <section className="section results-section">
            <div className="section-heading">
              <div><span className="section-kicker">02 / AI SIGNAL</span><h2>Analysis results</h2></div>
              <button className="ghost-btn" onClick={reset}><RefreshCw size={15} /> New analysis</button>
            </div>

            <div className="result-grid">
              <div className="result-hero glass">
                <div className="result-image"><img src={preview} alt="Analyzed lesion" /><div className="scan-line" /></div>
                <div className="result-main">
                  <span className="result-label">AI-PREDICTED CATEGORY</span>
                  <h3>{prediction.full_name}</h3>
                  <div className="confidence-row">
                    <div className="confidence-ring" style={{ "--p": `${prediction.confidence_percent * 3.6}deg` } as React.CSSProperties}>
                      <div><strong>{prediction.confidence_percent.toFixed(1)}%</strong><span>confidence</span></div>
                    </div>
                    <div>
                      <div className={prediction.low_confidence ? "warning-badge" : "good-badge"}>
                        {prediction.low_confidence ? <CircleAlert size={14} /> : <CheckCircle2 size={14} />}
                        {prediction.low_confidence ? "LOW CONFIDENCE" : "HIGHER CONFIDENCE"}
                      </div>
                      <p className="confidence-copy">
                        {prediction.low_confidence
                          ? "The model is not sufficiently confident in this classification."
                          : "The model assigned a stronger probability to this category."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prob-card glass">
                <div className="card-top"><div><span className="result-label">PROBABILITY PROFILE</span><h3>Model distribution</h3></div><span className="mini-chip">7 classes</span></div>
                <div className="chart">
                  <ResponsiveContainer width="100%" height={235}>
                    <AreaChart data={chartData} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}>
                      <defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#48f2bd" stopOpacity={0.34}/><stop offset="100%" stopColor="#48f2bd" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid stroke="rgba(255,255,255,.055)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "#71827d", fontSize: 10 }} interval={0} angle={-16} textAnchor="end" height={58} />
                      <YAxis domain={[0, 100]} tick={{ fill: "#71827d", fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                      <Tooltip contentStyle={{ background: "#101a18", border: "1px solid #28413b", borderRadius: 12 }} formatter={(v) => [`${v}%`, "Probability"]} />
                      <Area type="monotone" dataKey="value" stroke="#48f2bd" strokeWidth={2.5} fill="url(#areaFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="detail-grid">
              <div className="education glass">
                <div className="card-top"><div><span className="result-label">03 / EDUCATIONAL CONTEXT</span><h3>What this signal can mean</h3></div><div className="language"><Languages size={15}/><select value={language} onChange={(e) => setLanguage(e.target.value)}><option>English</option><option>Kannada</option><option>Hindi</option></select><ChevronDown size={13}/></div></div>
                {explainBusy ? <div className="skeleton"><i/><i/><i/></div> :
                  <div className="explanation">{explanation || "Educational explanation will appear here after analysis."}</div>}
                <div className="safety-inline"><ShieldCheck size={16}/><span>This content is educational context, not a diagnosis or treatment recommendation.</span></div>
              </div>

              <div className="watch glass">
                <div className="card-top"><span className="result-label">CLINICAL AWARENESS</span><Stethoscope size={18}/></div>
                <h3>Know when to seek professional review</h3>
                <ul>
                  <li>Noticeable change in size, shape, or color</li>
                  <li>Persistent bleeding, crusting, or irritation</li>
                  <li>A lesion that changes or does not settle</li>
                  <li>Any finding that concerns you</li>
                </ul>
                <div className="doctor-note"><Microscope size={16}/><span>A qualified dermatologist can evaluate a lesion using clinical examination and, when appropriate, further testing.</span></div>
              </div>
            </div>

            <div className="assistant glass">
              <div className="assistant-head">
                <div className="assistant-icon"><Sparkles size={19}/></div>
                <div><span className="result-label">EDUCATIONAL ASSISTANT</span><h3>Ask about this result</h3></div>
                <span className="ai-chip">GEMINI</span>
              </div>
              <div className="ask-row">
                <input value={question} onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") ask(); }}
                  placeholder="e.g. What characteristics are commonly associated with this category?" />
                <button onClick={ask} disabled={askBusy || !question.trim()}>{askBusy ? <span className="spinner"/> : <Sparkles size={16}/>} Ask</button>
              </div>
              {answer && <div className="answer"><span>AI RESPONSE</span><p>{answer}</p></div>}
            </div>
          </section>
        )}

        <section id="insights" className="section insights">
          <div className="section-heading"><div><span className="section-kicker">04 / SYSTEM PROFILE</span><h2>Built for transparent exploration</h2></div></div>
          <div className="insight-grid">
            <div className="info-card"><BrainCircuit size={22}/><span>MODEL</span><h3>EfficientNetB3</h3><p>Transfer-learning based image classifier used for the seven lesion categories.</p></div>
            <div className="info-card"><FlaskConical size={22}/><span>DATASET</span><h3>HAM10000</h3><p>Public dermatoscopic dataset used by the original project for model development.</p></div>
            <div className="info-card"><Languages size={22}/><span>LANGUAGES</span><h3>EN · KN · HI</h3><p>Educational explanation layer designed for English, Kannada, and Hindi.</p></div>
            <div className="info-card"><ShieldCheck size={22}/><span>PRIVACY</span><h3>API-controlled</h3><p>The Gemini credential stays on the backend and is never placed in the browser.</p></div>
          </div>
        </section>

        <section id="safety" className="safety-section">
          <div className="safety-symbol"><HeartPulse size={24}/></div>
          <div><span className="section-kicker">IMPORTANT</span><h2>Designed for education, not diagnosis.</h2><p>DermaAI provides model predictions and educational context for research and learning. It cannot confirm a skin condition, replace a clinical examination, or prescribe treatment. Please consult a qualified healthcare professional for medical evaluation of persistent or concerning lesions.</p></div>
        </section>
      </main>

      <footer><div className="brand"><span className="brand-mark"><ScanLine size={16}/></span><span>DERMA<span>AI</span></span></div><span>AI-powered skin lesion classification · educational research prototype</span><span>© 2026</span></footer>
    </div>
  );
}

export default App;