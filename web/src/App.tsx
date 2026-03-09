import { useState, useCallback, useRef } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const STYLES = ['Hip Hop', 'Contemporary', 'Ballet', 'Salsa', 'Breakdance', 'Jazz', 'K-Pop', 'Freestyle'];

function ScorePage() {
  const [style, setStyle] = useState('Hip Hop'); const [desc, setDesc] = useState(''); const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null);
  const ref = useRef<HTMLInputElement>(null);
  const analyze = useAction(api.ai.analyzePerformance); const save = useMutation(api.functions.saveScore);
  const handleFile = (f: File) => { const r = new FileReader(); r.onload = e => setImg(e.target?.result as string); r.readAsDataURL(f); };
  const getColor = (s: number) => s >= 7 ? 'var(--green)' : s >= 4 ? 'var(--accent)' : '#ef4444';

  const handleScore = useCallback(async () => {
    setLoading(true);
    try {
      const r = await analyze({ danceStyle: style, description: desc || undefined, imageBase64: img || undefined }); setResult(r); await save({ danceStyle: style, description: desc || undefined, ...r });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [style, desc, img, analyze, save]);

  return (
    <div className="mc"><div className="pg">
      <h1 className="title">Score Your <span className="a">Dance</span></h1>
      <p className="sub">Select a dance style and upload a photo or describe your performance for AI scoring.</p>
      <div className="chips">{STYLES.map(s => <button key={s} className={`chip ${style === s ? 'sel' : ''}`} onClick={() => setStyle(s)}>{s}</button>)}</div>
      {img ? <div className="preview-container"><img src={img} className="preview-image" alt="Dance" /><br /><button className="chip" onClick={() => setImg(null)} style={{ marginTop: '0.5rem' }}>Remove</button></div>
        : <div className="dropzone" onClick={() => ref.current?.click()}><p>💃 Upload a dance photo (optional)</p><input ref={ref} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} /></div>}
      <input className="inp" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe your performance (optional)..." />
      <button className="btn" disabled={loading} onClick={handleScore}>{loading ? '⏳ Judging...' : '💃 Score Performance'}</button>
      {loading && <div className="ld"><span /><span /><span /></div>}
      {result && !loading && <>
        <div className="score-display">{result.overallScore}/10</div>
        {result.breakdown?.map((c: any, i: number) => (
          <div key={i} className="cat-card"><div className="cat-head"><span>{c.category}</span><span className="cat-score" style={{ color: getColor(c.score) }}>{c.score}/10</span></div><div className="cat-bar"><div className="cat-fill" style={{ width: `${c.score * 10}%`, background: getColor(c.score) }} /></div><div className="cat-fb">{c.feedback}</div></div>
        ))}
        {result.highlights?.length > 0 && <div className="section"><div className="section-title">⭐ Highlights</div>{result.highlights.map((h: string, i: number) => <div key={i} className="list-item">✦ {h}</div>)}</div>}
        {result.improvements?.length > 0 && <div className="section"><div className="section-title">📈 Improvements</div>{result.improvements.map((m: string, i: number) => <div key={i} className="list-item">→ {m}</div>)}</div>}
      </>}
    </div></div>
  );
}

function App() {
  return (<BrowserRouter><div className="app">
    <header className="hdr"><a href="/"><span style={{ fontSize: '1.5rem' }}>💃</span><div><h1>DanceScore</h1></div></a></header>
    <Routes><Route path="/" element={<ScorePage />} /></Routes>
    <footer className="ftr">© {new Date().getFullYear()} DanceScore — An AVS Media App.</footer>
  </div></BrowserRouter>);
}
export default App;
