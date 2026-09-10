import { useEffect, useRef, useState } from "react";

function App() {
  const [count, setCount] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const requestInFlight = useRef(false);

  useEffect(() => {
    fetch("/api/download-count")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => setCount(null));
  }, []);

  const handleDownload = async () => {
    if (requestInFlight.current) return;

    requestInFlight.current = true;
    setDownloading(true);

    // Best-effort counter increment; download proceeds even if this fails.
    try {
      const res = await fetch("/api/download-count", { method: "POST" });
      const data = await res.json();
      setCount((currentCount) => Math.max(currentCount ?? 0, data.count));
    } catch (e) {
      // ignore counting errors
    }

    const link = document.createElement("a");
    link.href = "/Examination.docx";
    link.download = "Examination.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloading(false);
    requestInFlight.current = false;
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Prelim Examination</h1>
        <p className="subtitle">
          Word Processing, Presentation Skills &amp; Spreadsheet Skills
        </p>
        <button onClick={handleDownload} disabled={downloading}>
          {downloading ? "Preparing…" : "Download Exam (.docx)"}
        </button>
        {count !== null && (
          <p className="count">
            Downloaded {count} time{count === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
