// Neutral styling shared by every rendered screen.
export const css = `
*{box-sizing:border-box}
html,body{margin:0;background:#f7f6f3;color:#1c1b19;font:13px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
#root{padding:16px}
button{font:inherit;color:inherit}
.s-page{display:flex;flex-direction:column;gap:12px;max-width:1280px;margin:0 auto}
.s-page-title{font-size:18px;font-weight:650;display:flex;justify-content:space-between;align-items:center;gap:8px}
.s-stack{display:flex;flex-direction:column;gap:10px;min-width:0}
.s-with-side{display:grid;grid-template-columns:220px minmax(0,1fr);gap:12px}
.s-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:4px 0 8px;border-bottom:1px solid #e3dfd6}
.s-h1{font-size:17px;margin:0}
.s-sub{color:#6b665d;font-size:12px}
.s-sidebar{background:#fff;border:1px solid #e3dfd6;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px}
.s-box{background:#fff;border:1px solid #e3dfd6;border-radius:8px;padding:12px;min-width:0}
.s-section{background:transparent;border:0;padding:0}
.s-section>.s-box-head{border-bottom:1px solid #e3dfd6;padding-bottom:4px}
.s-box-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}
.s-box-title{font-size:13px;font-weight:650;margin:0}
.s-actions{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.s-footer{margin-top:8px;border-top:1px solid #efece5;padding-top:6px}
.s-stack:has(> .s-metric), .s-row{display:flex;flex-direction:row;flex-wrap:wrap;gap:10px}
.s-metric{background:#fff;border:1px solid #e3dfd6;border-radius:8px;padding:10px 12px;min-width:140px;flex:1 1 140px}
.s-card .s-metric,.s-region .s-metric{background:#faf9f6}
.s-metric-label{font-size:12px;color:#6b665d}
.s-metric-value{font-size:20px;font-weight:650;font-variant-numeric:tabular-nums}
.s-unit{font-size:12px;font-weight:400;color:#6b665d}
.s-delta{font-size:12px;font-variant-numeric:tabular-nums}
.s-basis{color:#6b665d}
.s-spark{color:#2a5bd7;display:block}
.s-chart{width:100%;height:160px;display:block}
.s-legend{display:flex;gap:10px;flex-wrap:wrap;font-size:11px;color:#6b665d}
.s-legend i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:4px}
.s-placeholder{color:#6b665d;background:#faf9f6;border:1px dashed #d6d1c6;border-radius:6px;padding:16px;text-align:center}
.s-table-wrap{overflow:auto;max-height:420px;min-width:0}
.s-table{border-collapse:collapse;width:100%;font-size:12px}
.s-table th{text-align:left;font-weight:600;color:#4a463f;border-bottom:1px solid #d6d1c6;padding:5px 8px;white-space:nowrap;position:sticky;top:0;background:#fff}
.s-table td{border-bottom:1px solid #efece5;padding:5px 8px;vertical-align:top}
.s-table td.num{text-align:right;font-variant-numeric:tabular-nums}
.s-table tr.click{cursor:pointer}.s-table tr.click:hover td{background:#f4f2ed}
.s-table tr.sel td{background:#e8eefc}
.s-table .sticky{position:sticky;left:0;background:inherit}
.s-rowhead{font-weight:600;color:#4a463f}
.s-timeline{display:flex;flex-direction:column;gap:4px}
.s-event{display:grid;grid-template-columns:120px 1fr;gap:8px;border-left:2px solid #d6d1c6;padding-left:8px}
.s-when{color:#6b665d;font-size:12px;font-variant-numeric:tabular-nums}
.s-status{display:inline-block;border:1px solid;border-radius:999px;padding:0 8px;font-size:11px;font-weight:600;background:#fff}
.s-notice{border-radius:6px;padding:6px 10px;font-size:12px;display:flex;gap:6px;align-items:center}
.s-empty{background:#f4f2ed}.s-partial,.s-stale{background:#fff4e0;color:#6e4300}.s-error{background:#fdecea;color:#8c1d18}
.s-btn{border:1px solid #bdb7aa;background:#fff;border-radius:6px;padding:3px 10px;cursor:pointer}
.s-btn:hover{background:#f4f2ed}
.s-btn.primary{background:#1c1b19;color:#fff;border-color:#1c1b19}
.s-btn.danger{color:#b3261e;border-color:#b3261e}
.s-filterbar,.s-views,.s-bulk{display:flex;gap:6px;flex-wrap:wrap;align-items:center;background:#fff;border:1px solid #e3dfd6;border-radius:8px;padding:6px 8px}
.s-filter{border:1px solid #d6d1c6;border-radius:6px;padding:2px 8px;font-size:12px}
.s-chip{border:1px solid #d6d1c6;background:#fff;border-radius:999px;padding:1px 10px;font-size:12px;cursor:pointer}
.s-chip.on{background:#1c1b19;color:#fff;border-color:#1c1b19}
.s-tabs{display:flex;flex-direction:column;gap:8px}
.s-tablist{display:flex;gap:2px;border-bottom:1px solid #d6d1c6}
.s-tablist button{border:0;background:none;padding:6px 12px;cursor:pointer;border-bottom:2px solid transparent}
.s-tablist button.on{border-bottom-color:#1c1b19;font-weight:600}
.s-drawer{position:fixed;top:0;right:0;bottom:0;width:min(420px,90vw);background:#fff;border-left:1px solid #d6d1c6;box-shadow:-8px 0 24px rgba(0,0,0,.12);padding:14px;overflow:auto;z-index:10}
.s-pattern{display:flex;flex-direction:column;gap:10px}
.s-region{min-width:0;display:flex;flex-direction:column;gap:8px}
.s-split{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:12px}
.s-split.even{grid-template-columns:1fr 1fr}
.s-queue{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1fr);gap:12px}
.s-list{display:flex;flex-direction:column;border:1px solid #e3dfd6;border-radius:6px;overflow:hidden}
.s-list-item{padding:6px 8px;border-bottom:1px solid #efece5}.s-list-item.on{background:#e8eefc;font-weight:600}
.s-kv{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;margin:0;font-size:12px}.s-kv dt{color:#6b665d}.s-kv dd{margin:0}
.s-unknown{border:1px dashed #bdb7aa;border-radius:6px;padding:8px}
.s-crash{background:#fdecea;color:#8c1d18;border:1px solid #e8b4ae;border-radius:8px;padding:12px}
h1,h2,h3{margin:4px 0}
`;
