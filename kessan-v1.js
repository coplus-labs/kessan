/* 動く決算報告資料 固定プログラム（コプラス） 版：v1
   使い方：HTMLに window.KESSAN={data:{…},text:{…}} を書き、このファイルを読み込む。
   数字はすべて data から計算する。文章の中の数字は {差し込み記号} で書く。 */
(function(){
"use strict";
const KS=window.KESSAN;
if(!KS||!KS.data){document.body.innerHTML='<p style="font:18px sans-serif;padding:40px">資料のデータが見つかりません。</p>';return}
/* ---------- 画面の骨組み ---------- */
const CSS="\n:root{--p:#1F5FA8;--p2:#6F9CD3;--p3:#A9C6E8;--p4:#DCE8F5;--nv:#0E2A47;--bx:#F1F5FA;--ln:#D9E1EA;--tx:#1C2430;--nt:#66737F;--dk:#5B6670;--g1:#C4CCD5;--g2:#D5DCE3;--g3:#E6EAEF;--bg:#E9EEF4;color-scheme:light}\n*{box-sizing:border-box}\nhtml,body{height:100%;margin:0;background:var(--bg);overflow:hidden}\nbody{font-family:\"Noto Sans JP\",\"Hiragino Sans\",\"Yu Gothic\",Meiryo,sans-serif;color:var(--tx);font-variant-numeric:tabular-nums}\n#vp{position:fixed;inset:0;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}\n#stage{position:absolute;left:0;top:0;width:1920px;height:1080px;background:#fff;transform-origin:0 0;overflow:hidden}\nsection{position:absolute;left:0;top:0;width:1920px;height:1080px;padding:64px 88px;opacity:0;visibility:hidden;transition:transform .6s ease-out,opacity .6s ease-out,visibility 0s .6s}\nsection.on{opacity:1;visibility:visible;transition:transform .6s ease-out,opacity .6s ease-out}\n.sec{font-size:26px;font-weight:700;color:var(--p);line-height:36px}\nh2{font-size:50px;font-weight:700;margin:8px 0 0;line-height:70px;white-space:nowrap;letter-spacing:0}\nh2 span{display:inline-block}\n.body{position:absolute;left:88px;right:88px;top:212px;bottom:96px}\n.src{position:absolute;left:88px;bottom:34px;font-size:18px;color:var(--nt)}\n.rv{opacity:0;transform:translateY(14px);transition:opacity .5s ease-out,transform .5s ease-out}\n.rv.in{opacity:1;transform:none}\n.static *{transition:none!important;animation:none!important}\n.static .rv,.static .prow{opacity:1!important;transform:none!important}\n.lc{position:absolute;left:0;top:0;bottom:0}\n.rc{position:absolute;right:0;top:0;bottom:0}\n.tr{display:flex;align-items:baseline;gap:20px;height:34px}\n.ttl{font-size:24px;font-weight:700}\n.hint{font-size:18px;color:var(--p);font-weight:500}\n.ctl{display:flex;gap:16px;align-items:center;margin-top:12px;height:52px}\n.seg{display:flex;border:1px solid var(--ln);border-radius:6px;overflow:hidden}\n.seg button,.play{font:inherit;font-size:20px;padding:8px 22px;border:0;background:#fff;color:var(--tx);cursor:pointer;transition:background .2s,color .2s}\n.seg button+button{border-left:1px solid var(--ln)}\n.seg button.on{background:var(--p);color:#fff}\n.play{border:1px solid var(--p);border-radius:6px;color:var(--p);font-weight:700}\n.play:hover,.seg button:hover:not(.on){background:var(--p4)}\nbutton:focus-visible,input:focus-visible,.ck:focus-visible{outline:3px solid var(--p2);outline-offset:2px}\n.box{background:var(--bx);border-radius:6px;padding:30px 34px}\n.bt{font-size:24px;font-weight:700;margin-bottom:12px}\n.bs{font-size:20px;line-height:1.6;margin-bottom:18px}\n.tb{width:100%;border-collapse:collapse;font-size:20px}\n.tb th{font-size:18px;color:var(--nt);font-weight:500;text-align:right;padding:6px 8px;border-bottom:1px solid var(--ln)}\n.tb th:first-child,.tb td:first-child{text-align:left}\n.tb td{text-align:right;padding:9px 8px;border-bottom:1px solid var(--ln)}\n.tb tr.ck{cursor:pointer;transition:background .15s}\n.tb tr.ck:hover{background:#fff;outline:2px solid var(--p2)}\n.tb tr.hl td{font-weight:700}\n.tb.roomy td{padding:14px 8px}\n.tb td.c{color:var(--p);font-weight:700}\n.neg{color:var(--dk)}\n.note{font-size:18px;color:var(--nt);line-height:1.6;margin-top:14px}\n.chk{font-size:18px;color:var(--tx);margin-top:16px;padding-top:12px;border-top:1px solid var(--ln);line-height:1.6}\nsvg text{font-family:inherit}\n.vl{font-size:22px;font-weight:700;fill:var(--tx)}\n.vl.neg{fill:var(--dk)}\n.nm{font-size:18px;fill:var(--tx)}\n.nt{font-size:18px;fill:var(--nt)}\n.ax{stroke:var(--tx);stroke-width:1.5}\n.con{stroke:var(--nt);stroke-width:1.2;stroke-dasharray:3 4}\n.link{stroke:var(--nv);stroke-width:2;stroke-dasharray:2 6;fill:none}\nsvg text.nm{transition:opacity .3s}\n.hov{cursor:pointer;transition:transform .15s,filter .15s;transform-box:fill-box}\n.hov:hover{transform:translateY(-2px);filter:drop-shadow(0 4px 5px rgba(14,42,71,.28));stroke:var(--p);stroke-width:2}\n.sel{stroke:var(--p)!important;stroke-width:6px!important}\n.glow{animation:glow 1.1s ease-out 1}\n@keyframes glow{0%{stroke:var(--p);stroke-width:0}35%{stroke:var(--p);stroke-width:7px}100%{stroke:var(--p);stroke-width:0}}\n.ping{position:relative}\n.ping::after{content:\"\";position:absolute;inset:-5px;border:3px solid var(--p);border-radius:inherit;pointer-events:none;animation:ring 1.3s ease-out 1 forwards}\n@keyframes ring{0%{opacity:.95;transform:scale(1)}100%{opacity:0;transform:scale(1.4)}}\n.co{opacity:0;transition:opacity .35s}\n.co.on{opacity:1}\n.co rect{fill:var(--nv)}\n.co text{fill:#fff;font-size:20px;font-weight:700}\n.dot{transition:opacity .3s}\n/* cover */\nsection.cover{background:var(--nv);color:#fff}\n.cv-n{font-size:30px;color:var(--p3);font-weight:700;margin-top:24px}\n.cv-t{font-size:100px;font-weight:900;margin-top:36px;line-height:1.15}\n.cv-p{font-size:24px;color:var(--p3);margin-top:22px}\n.cv-g{position:absolute;left:88px;top:440px}\n.cv-l{fill:#fff;font-size:24px;font-weight:700}\n.cv-u{fill:var(--p3);font-size:20px}\n.cv-c{position:absolute;left:88px;top:790px;font-size:42px;font-weight:700}\n.cv-h{position:absolute;left:88px;bottom:36px;font-size:18px;color:var(--p3)}\n/* p1 */\n.kpis{position:absolute;left:0;right:0;top:0;height:300px;display:flex}\n.kpi{flex:1;padding:0 36px;border-left:1px solid var(--ln);cursor:pointer;border-radius:6px;transition:background .15s,transform .15s}\n.kpi:first-child{border-left:0;padding-left:0}\n.kpi:hover{background:var(--bx);transform:translateY(-2px)}\n.kl{font-size:24px;font-weight:700;display:flex;justify-content:space-between;align-items:baseline}\n.kv{margin-top:4px;white-space:nowrap}\n.big{font-size:96px;font-weight:700;line-height:1.1}\n.big.neg{color:var(--dk)}\n.ku{font-size:24px;margin-left:8px;color:var(--nt)}\n.kr{display:flex;align-items:flex-end;gap:22px;margin-top:6px}\n.kdl{font-size:18px;color:var(--nt)}\n.kdv{font-size:32px;font-weight:700}\n.cards{position:absolute;left:0;right:0;top:332px;height:330px;display:flex;gap:56px}\n.card{flex:1;border:1px solid var(--ln);border-radius:8px;padding:22px 22px 18px;cursor:pointer;display:flex;flex-direction:column;background:#fff;transition:opacity .5s,transform .15s,box-shadow .15s,border-color .15s}\n.card:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(14,42,71,.16);border-color:var(--p)}\n.ct{font-size:22px;font-weight:700}\n.cd{font-size:44px;font-weight:700;color:var(--p);margin-top:2px;white-space:nowrap}\n.cd.neg{color:var(--dk)}\n.cd small{font-size:20px;font-weight:500;margin-left:4px}\n.cf{font-size:18px;color:var(--nt);margin-top:6px;line-height:1.45}\n.cs{font-size:20px;line-height:1.5;margin-top:10px;flex:1}\n.cg{display:flex;justify-content:space-between;align-items:center;font-size:18px;color:var(--p);font-weight:700}\n.tg,.ib{display:inline-flex;align-items:center;justify-content:center;border-radius:20px;background:var(--p);color:#fff;font-size:18px;font-weight:700;padding:2px 12px}\n.arw{position:absolute;left:0;top:332px;pointer-events:none}\n.issues{position:absolute;left:0;right:0;bottom:0;height:76px;display:flex;align-items:center;gap:30px;background:var(--bx);border-radius:8px;padding:0 28px}\n.il{font-size:20px;font-weight:700;color:var(--nt)}\n.iss{font-size:24px;font-weight:700;display:flex;align-items:center;gap:10px;cursor:pointer;padding:4px 10px;border-radius:6px}\n.iss:hover{outline:2px solid var(--p2)}\n.ib{width:38px;height:38px;padding:0;font-size:22px}\n/* p7 */\n.iq{border-left:6px solid var(--p);padding:18px 24px 20px;margin-bottom:24px;cursor:pointer;border-radius:0 8px 8px 0;background:#fff;transition:background .15s,transform .15s}\n.iq:hover{background:var(--bx);transform:translateY(-2px)}\n.iqh{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:700}\n.iqd{font-size:21px;line-height:1.7;margin-top:10px}\n.iqd b{font-weight:700}\n.iqf{font-size:19px;color:var(--p);margin-top:8px;font-weight:500}\n.sim{border:1px solid var(--ln);border-radius:8px;padding:24px 30px}\n.sl{display:grid;grid-template-columns:200px 1fr 230px;align-items:center;gap:16px;height:56px;font-size:20px}\n.sl input{width:100%;accent-color:var(--p)}\n.sl output{text-align:right;font-weight:700}\n.res{display:flex;align-items:baseline;gap:20px;margin:6px 0 2px}\n.res .rb{font-size:72px;font-weight:700;border:2px dashed var(--p);border-radius:6px;padding:0 16px;line-height:1.15}\n.res .rb.neg{color:var(--dk);border-color:var(--dk)}\n.res .rl{font-size:20px;font-weight:700}\n.res .rd{font-size:24px;font-weight:700}\n.fxs{font-size:18px;line-height:1.6;color:var(--tx)}\n.fxs .nt2{color:var(--nt)}\n/* panel */\n#dim{position:absolute;inset:0;background:rgba(14,42,71,.38);opacity:0;visibility:hidden;transition:opacity .4s,visibility 0s .4s;z-index:20}\n#dim.on{opacity:1;visibility:visible;transition:opacity .4s}\n#panel{position:absolute;top:0;right:0;width:720px;height:1080px;background:#fff;z-index:21;transform:translateX(100%);transition:transform .4s ease-out;padding:56px 56px 40px;display:flex;flex-direction:column;box-shadow:-8px 0 24px rgba(14,42,71,.18)}\n#panel.on{transform:none}\n#px{position:absolute;right:28px;top:22px;font:inherit;font-size:34px;line-height:1;border:0;background:none;cursor:pointer;color:var(--tx);padding:6px 12px}\n.crumb{font-size:18px;color:var(--nt)}\n.say{font-size:24px;font-weight:700;line-height:1.55;margin-top:12px}\n.tabs{display:flex;gap:0;margin-top:24px;border-bottom:2px solid var(--ln)}\n.tabs button{font:inherit;font-size:20px;border:0;background:none;padding:10px 22px;cursor:pointer;color:var(--nt);border-bottom:3px solid transparent;margin-bottom:-2px}\n.tabs button.on{color:var(--p);border-bottom-color:var(--p);font-weight:700}\n.tbx{flex:1;overflow:auto;padding-top:18px}\n.pu{font-size:18px;color:var(--nt);text-align:right}\n.pt{width:100%;border-collapse:collapse;font-size:20px;margin-top:4px}\n.pt th{font-size:18px;color:var(--nt);font-weight:500;text-align:right;padding:6px 8px;border-bottom:1px solid var(--ln)}\n.pt td{text-align:right;padding:8px;border-bottom:1px solid var(--ln)}\n.pt th:first-child,.pt td.l{text-align:left}\n.prow{opacity:0;animation:rowin .3s ease-out forwards}\n@keyframes rowin{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}\n.fx{margin-top:18px;font-size:18px;line-height:1.6;background:var(--bx);border-radius:6px;padding:14px 18px}\n.fx div+div{margin-top:6px}\n.ask{font-size:22px;line-height:1.6;padding-left:1.4em;margin:0}\n.ask li{margin-bottom:16px}\n.psrc{font-size:18px;color:var(--nt);border-top:1px solid var(--ln);padding-top:12px}\n/* chrome */\n#nav{position:absolute;right:88px;bottom:22px;display:flex;align-items:center;gap:12px;font-size:20px;color:var(--nt);z-index:10}\n#nav button{font:inherit;font-size:24px;width:46px;height:40px;border:1px solid var(--ln);background:#fff;border-radius:6px;cursor:pointer;color:var(--tx)}\n#nav button:hover{border-color:var(--p)}\n.oncover #nav{color:var(--p3)}\n.oncover #nav button{background:transparent;color:#fff;border-color:#3a5576}\n#tip{position:absolute;z-index:30;background:var(--nv);color:#fff;font-size:18px;padding:8px 14px;border-radius:6px;pointer-events:none;opacity:0;transition:opacity .15s;white-space:nowrap}\n#grid{position:absolute;inset:0;z-index:40;background:rgba(233,238,244,.97);display:none;padding:80px 88px;grid-template-columns:repeat(4,1fr);gap:28px;align-content:start}\n#grid.on{display:grid}\n.tile{background:#fff;border:1px solid var(--ln);border-radius:8px;padding:22px;cursor:pointer;height:220px}\n.tile:hover{border-color:var(--p)}\n.tile .tn{font-size:20px;color:var(--p);font-weight:700}\n.tile .th{font-size:22px;font-weight:700;line-height:1.5;margin-top:10px}\n#dm{position:absolute;right:88px;top:26px;font-size:18px;color:var(--p);z-index:15;display:none;font-weight:700}\n#dm.on{display:block}\n.oncover #dm{color:var(--p3)}\n@media print{\n @page{size:1920px 1080px;margin:0}\n html,body{overflow:visible;height:auto;background:#fff}\n #vp{position:static;padding:0}\n #stage{position:relative;transform:none!important;height:auto;overflow:visible}\n section{position:relative!important;opacity:1!important;visibility:visible!important;transform:none!important;break-after:page;page-break-after:always;transition:none!important}\n #nav,#panel,#dim,#tip,#grid,#dm,.play,.hint{display:none!important}\n .rv,.prow,.dot{opacity:1!important;transform:none!important}\n *{-webkit-print-color-adjust:exact;print-color-adjust:exact}\n}\n\n#chk{position:absolute;left:88px;right:88px;top:6px;z-index:50;display:none;background:#FFF6E0;border:2px solid #B7791F;color:#4A3200;font-size:18px;line-height:1.5;padding:8px 14px;border-radius:6px}\n#chk{display:none;align-items:center;gap:8px;white-space:nowrap}\n#chk .cm{flex:1;overflow:hidden;text-overflow:ellipsis}\n.haschk section{top:46px}\n#panel:not(.on){box-shadow:none}\n.nw{white-space:nowrap}\n#chk button{font:inherit;font-size:16px;margin-left:8px;border:1px solid #B7791F;background:#fff;border-radius:4px;cursor:pointer;padding:2px 10px}\n#chkall{position:absolute;left:160px;right:160px;top:80px;bottom:80px;z-index:60;display:none;background:#fff;border:2px solid #B7791F;border-radius:8px;padding:30px 40px;overflow:auto;font-size:19px;line-height:1.6;box-shadow:0 10px 30px rgba(14,42,71,.25)}\n#chkall li{margin-bottom:8px}\n@media print{#chk,#chkall{display:none!important}}\n";
(function(){const d=document,h=d.head||d.documentElement;
 [["preconnect","https://fonts.googleapis.com"],["preconnect","https://fonts.gstatic.com"]].forEach(([r,u])=>{const l=d.createElement("link");l.rel=r;l.href=u;if(u.includes("gstatic"))l.crossOrigin="";h.appendChild(l)});
 const f=d.createElement("link");f.rel="stylesheet";f.href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap";h.appendChild(f);
 const st=d.createElement("style");st.textContent=CSS;h.appendChild(st);
 if(!d.querySelector("meta[name=viewport]")){const m=d.createElement("meta");m.name="viewport";m.content="width=device-width, initial-scale=1, viewport-fit=cover";h.appendChild(m)}
 const w=d.createElement("div");w.id="vp";
 w.innerHTML=`<div id="stage">${[0,1,2,3,4,5,6,7].map(i=>`<section id="s${i}"></section>`).join("")}<div id="nav"><button id="nb" aria-label="前のページ">‹</button><span id="pn"></span><button id="nf" aria-label="次のページ">›</button></div><div id="dm">自動デモ中（D以外のキーかクリックで止まります）</div><div id="dim"></div><aside id="panel" aria-hidden="true"><button id="px" aria-label="閉じる">×</button><div class="crumb" id="pc"></div><div class="say" id="ps"></div><div class="tabs"><button data-t="0" class="on">内訳と計算式</button><button data-t="1">社長に聞きたいこと</button></div><div class="tbx" id="pt0"></div><div class="tbx" id="pt1" hidden></div><div class="psrc" id="psrc"></div></aside><div id="grid"></div><div id="tip"></div><div id="chk"></div><div id="chkall"></div></div>`;
 d.body.appendChild(w)})();
/* ---------- 基本 ---------- */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const NS="http://www.w3.org/2000/svg";
function E(t,a={},p,x){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(x!=null)e.textContent=x;if(p)p.appendChild(e);return e}
const nul=v=>v==null||isNaN(v);
const fm=v=>{if(nul(v))return"xx";const r=Math.round(Math.abs(v)/1e5);return(v<0&&r?"▲":"")+(r/10).toFixed(1)};
const fs=v=>nul(v)?"xx":(Math.round(v/1e5)>0?"+":"")+fm(v);
const fk=v=>{if(nul(v))return"xx";const r=Math.round(Math.abs(v)/1000);return(v<0&&r?"▲":"")+r.toLocaleString("ja-JP")};
const fks=v=>nul(v)?"xx":(Math.round(v/1000)>0?"+":"")+fk(v);
const fy=v=>nul(v)?"xx":(v<0?"▲":"")+Math.abs(Math.round(v)).toLocaleString("ja-JP");
const f1=v=>{if(nul(v))return"xx";const r=Math.round(Math.abs(v)*10);return(v<0&&r?"▲":"")+(r/10).toFixed(1)};
const f1s=v=>nul(v)?"xx":(Math.round(v*10)>0?"+":"")+f1(v);
const pc=v=>f1(v)+"%";
const sum=a=>a.reduce((x,y)=>x+y,0);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const I3=[0,1,2];
/* ---------- データを整える（足りない科目は0、合わない分は「その他」） ---------- */
const WARN=[];const warn=(lv,m)=>WARN.push({lv,m});
const R0=KS.data;
const arr=(a,nm,req)=>{if(Array.isArray(a)&&a.length===3&&a.every(v=>typeof v==="number"&&isFinite(v)))return a.map(Math.round);if(req)warn("要修正",`${nm}の数字が3期分そろっていません`);return[0,0,0]};
const has=a=>Array.isArray(a)&&a.length===3;
const PD=Array.isArray(R0.periods)&&R0.periods.length===3?R0.periods.map(String):(warn("要修正","期の名前（periods）が3つありません"),["第1期","第2期","第3期"]);
const RG=Array.isArray(R0.ranges)&&R0.ranges.length===3?R0.ranges.map(String):null;
const P=R0.pl||{},M=R0.mc||null,B=R0.bs||{};
const pl={sales:arr(P.sales,"売上高",1),cogs:arr(P.cogs,"売上原価",1),sga:arr(P.sga,"販管費",1),op:arr(P.op,"営業利益",1),ni:arr(P.ni,"当期純利益",1)};
pl.gp=has(P.gp)?arr(P.gp,"売上総利益"):I3.map(i=>pl.sales[i]-pl.cogs[i]);
["noi","noe","ord","tax"].forEach(k=>pl[k]=has(P[k])?arr(P[k],k):null);
I3.forEach(i=>{if(Math.abs(pl.sales[i]-pl.cogs[i]-pl.gp[i])>1)warn("要確認",`${PD[i]}：売上高−売上原価が売上総利益と合いません（差 ${fy(pl.sales[i]-pl.cogs[i]-pl.gp[i])}円）`);
 if(Math.abs(pl.gp[i]-pl.sga[i]-pl.op[i])>1)warn("要確認",`${PD[i]}：売上総利益−販管費が営業利益と合いません（差 ${fy(pl.gp[i]-pl.sga[i]-pl.op[i])}円）`)});
/* 販管費の内訳：kind=pers（人件費）・dep（減価償却費）。合計との差は「その他の販管費」 */
const SGI=(Array.isArray(P.sgaItems)?P.sgaItems:[]).filter(x=>x&&x.l&&has(x.v)).map((x,j)=>({k:"sg"+j,l:/^その他$/.test(String(x.l).trim())?"その他の販管費":String(x.l),v:arr(x.v,x.l),kind:x.kind||""}));
{const rest=I3.map(i=>pl.sga[i]-sum(SGI.map(x=>x.v[i])));if(rest.some(v=>v!==0))SGI.push({k:"sg"+SGI.length,l:SGI.length?"その他の販管費":"販管費",v:rest,kind:""})}
I3.forEach(i=>{if(SGI.some(x=>x.v[i]<0&&x.l==="その他の販管費"))0});
const SGL={};SGI.forEach(x=>{pl[x.k]=x.v;SGL[x.k]=x.l});
const sgKind=k=>I3.map(i=>sum(SGI.filter(x=>x.kind===k).map(x=>x.v[i])));
/* 製造原価：無ければ売上原価をそのまま使う */
const MC=!!(M&&has(M.mat));
const mc=MC?{mat:arr(M.mat,"材料費"),out:has(M.out)?arr(M.out,"外注加工費"):[0,0,0],labor:has(M.labor)?arr(M.labor,"労務費"):[0,0,0],mdep:has(M.mdep)?arr(M.mdep,"製造原価の減価償却費"):[0,0,0],mexp:has(M.mexp)?arr(M.mexp,"製造経費"):[0,0,0]}:{mat:pl.cogs.slice(),out:[0,0,0],labor:[0,0,0],mdep:[0,0,0],mexp:[0,0,0]};
mc.adj=I3.map(i=>pl.cogs[i]-mc.mat[i]-mc.out[i]-mc.labor[i]-mc.mdep[i]-mc.mexp[i]);
const bs={};["cash","ar","inv","oca","ppe","ioa","ap","accr","taxp","stl","ltl","cap","re"].forEach(k=>bs[k]=has(B[k])?arr(B[k],k):[0,0,0]);
bs.ta=arr(B.ta,"資産合計",1);bs.na=arr(B.na,"純資産合計",1);
bs.tl=has(B.tl)?arr(B.tl,"負債合計"):I3.map(i=>bs.ta[i]-bs.na[i]);
bs.tle=I3.map(i=>bs.tl[i]+bs.na[i]);
I3.forEach(i=>{if(Math.abs(bs.ta[i]-bs.tle[i])>1)warn("要確認",`${PD[i]}末：資産合計と負債・純資産合計が合いません（差 ${fy(bs.ta[i]-bs.tle[i])}円）`)});
bs.ra=I3.map(i=>bs.ta[i]-bs.cash[i]-bs.ar[i]-bs.inv[i]-bs.oca[i]-bs.ppe[i]-bs.ioa[i]);
bs.ol=I3.map(i=>bs.tl[i]-bs.ap[i]-bs.accr[i]-bs.taxp[i]-bs.stl[i]-bs.ltl[i]);
bs.oth=I3.map(i=>bs.oca[i]+bs.ioa[i]+bs.ra[i]);
bs.acc2=I3.map(i=>bs.accr[i]+bs.taxp[i]+bs.ol[i]);
if(bs.na.some(v=>v<0))warn("要確認","純資産がマイナスの期があります。面積図は0で止めて表示しています");
const capexIn=Array.isArray(R0.capex)?R0.capex:[null,null,null];
const S=pl.sales,NAME=R0.showName&&R0.name?String(R0.name):"貴社";
const dl=(a,i)=>a[i]-a[i-1];
const LB=Object.assign({sales:"売上高",cogs:"売上原価",gp:"売上総利益",sga:"販管費",op:"営業利益",mat:MC?"材料費":"売上原価",out:"外注加工費",labor:"製造労務費",mdep:"製造原価の減価償却費",mexp:"製造経費（その他）"},SGL);
const gpR=i=>pl.gp[i]/S[i]*100,opR=i=>pl.op[i]/S[i]*100;
const per=i=>({mat:mc.mat[i]/S[i]*100,out:mc.out[i]/S[i]*100,labor:mc.labor[i]/S[i]*100,exp:(mc.mdep[i]+mc.mexp[i]+mc.adj[i])/S[i]*100,sga:pl.sga[i]/S[i]*100,op:pl.op[i]/S[i]*100});
const PERS=sgKind("pers"),DEPS=sgKind("dep");
const pers=i=>PERS[i]+mc.labor[i];
const arM=i=>bs.ar[i]/(S[i]/12),invM=i=>bs.inv[i]/(S[i]/12),eqR=i=>bs.na[i]/bs.ta[i]*100;
const CA=i=>bs.cash[i]+bs.ar[i]+bs.inv[i]+bs.oca[i],CL=i=>bs.ap[i]+bs.accr[i]+bs.taxp[i]+bs.stl[i],curR=i=>CA(i)/CL(i)*100;
const depT=i=>DEPS[i]+mc.mdep[i];
const capex=i=>capexIn[i]!=null&&isFinite(capexIn[i])?{v:Math.round(capexIn[i]),est:false}:{v:dl(bs.ppe,i)+depT(i),est:true};
if(!DEPS.some(v=>v)&&!mc.mdep.some(v=>v))warn("要確認","減価償却費が0です。販管費の内訳に kind:\"dep\" を付けたか確かめてください（お金の流れの計算に使います）");
function CF(i){const st=[
 {k:"ni",l:"当期\n純利益",v:pl.ni[i]},{k:"dep",l:"減価\n償却費",v:depT(i)},{k:"ar",l:"売掛金",v:-dl(bs.ar,i)},{k:"inv",l:"棚卸\n資産",v:-dl(bs.inv,i)},
 {k:"ap",l:"買掛金",v:dl(bs.ap,i)},{k:"oth",l:"その他\n（営業）",v:-dl(bs.oca,i)+dl(bs.accr,i)+dl(bs.taxp,i)+dl(bs.ol,i)},
 {k:"icf",l:"投資CF",v:-capex(i).v-dl(bs.ioa,i)-dl(bs.ra,i)},{k:"fcf",l:"財務CF",v:dl(bs.stl,i)+dl(bs.ltl,i)}];
 const gap=dl(bs.cash,i)-sum(st.map(x=>x.v));if(gap)st.push({k:"gap",l:"その他",v:gap});
 return{i,st,start:bs.cash[i-1],end:bs.cash[i],sl:"期首\n現預金",el:"期末\n現預金",ocf:sum(st.slice(0,6).map(x=>x.v)),icf:st[6].v,fcf:st[7].v,gap};}
const SGK=SGI.map(x=>x.k);
function PW(a,b){const st=[{k:"sales",l:"売上高",v:S[b]-S[a]},{k:"cogs",l:"売上原価",v:-(pl.cogs[b]-pl.cogs[a])}];
 const g=SGK.map(k=>({k,l:LB[k],v:-(pl[k][b]-pl[k][a])})).sort((x,y)=>Math.abs(y.v)-Math.abs(x.v));
 const rest=g.slice(5);st.push(...g.slice(0,5));if(rest.length)st.push({k:"rest",l:`その他${rest.length}科目`,v:sum(rest.map(x=>x.v)),items:rest});
 const gap=pl.op[b]-pl.op[a]-sum(st.map(x=>x.v));if(gap)st.push({k:"gap",l:"端数・その他",v:gap});
 return{a,b,st,start:pl.op[a],end:pl.op[b],sl:`${PD[a]}\n営業利益`,el:`${PD[b]}\n営業利益`};}
const PWS=[PW(0,1),PW(1,2)],CFS=[null,CF(1),CF(2)];
const g2=(S[2]/S[1]-1)*100,P0=per(0),P2=per(2);
const V0=mc.mat[2]+mc.out[2],F0=pl.cogs[2]-V0+pl.sga[2],M0=mc.mat[2]/S[2]*100,O0=mc.out[2]/S[2]*100;
const NUM=["①","②","③"];
/* ---------- 動きを表す言葉（3期とも同じ向きのときだけ「続け」） ---------- */
const mv3=(a,up,dn,mix)=>a[1]>a[0]&&a[2]>a[1]?up:a[1]<a[0]&&a[2]<a[1]?dn:mix;
const amtW=a=>mv3(a,"増え続け","減り続け","増減し"),rateW=a=>mv3(a,"上がり続け","下がり続け","上下し"),turnW=a=>mv3(a,"長くなり続け","短くなり続け","長短し");
const dirW=(v,u="増え",d="減り")=>Math.round(v/1000)>0?u:Math.round(v/1000)<0?d:"横ばいとなり";
const trR=a=>a.map(pc).join("→"),trM=a=>a.map(v=>fm(v)+"百万円").join("→"),trY=a=>a.map(v=>f1(v)+"円").join("→"),trT=a=>a.map(v=>f1(v)+"か月").join("→");
const cr=I3.map(i=>mc.mat[i]/S[i]*100),gr=I3.map(gpR),orr=I3.map(opR),er=I3.map(eqR),at=I3.map(arM),it=I3.map(invM),sgr=I3.map(i=>pl.sga[i]/S[i]*100),cgr=I3.map(i=>pl.cogs[i]/S[i]*100);
const debt=I3.map(i=>bs.stl[i]+bs.ltl[i]);
/* ---------- 差し込み記号 ---------- */
const TOK={
 "当期":PD[2],"前期":PD[1],"前々期":PD[0],"社名":NAME,
 "売上_当期":fm(S[2])+"百万円","売上_前期":fm(S[1])+"百万円","売上_前々期":fm(S[0])+"百万円","売上_前期差":fs(dl(S,2))+"百万円","売上_前期比":f1s(g2)+"%","売上_2期増減額":fs(S[2]-S[0])+"百万円","売上_2期増減率":f1s((S[2]/S[0]-1)*100)+"%","売上_推移":trM(S),"売上_動き":amtW(S),
 "売上総利益_当期":fm(pl.gp[2])+"百万円","売上総利益_前期差":fs(dl(pl.gp,2))+"百万円","粗利率_当期":pc(gr[2]),"粗利率_推移":trR(gr),"粗利率_2期差":f1s(gr[2]-gr[0])+"ポイント","粗利率_動き":rateW(gr),
 "売上原価率_推移":trR(cgr),"売上原価率_動き":rateW(cgr),
 "営業利益_当期":fm(pl.op[2])+"百万円","営業利益_前期":fm(pl.op[1])+"百万円","営業利益_前期差":fs(dl(pl.op,2))+"百万円","営業利益_前期比":f1s((pl.op[2]/pl.op[1]-1)*100)+"%","営業利益_推移":trM(pl.op),"営業利益_動き":amtW(pl.op),
 "営業利益率_当期":pc(orr[2]),"営業利益率_推移":trR(orr),"営業利益率_動き":rateW(orr),
 "経常利益_当期":pl.ord?fm(pl.ord[2])+"百万円":"xx","当期純利益_当期":fm(pl.ni[2])+"百万円",
 "販管費_当期":fm(pl.sga[2])+"百万円","販管費_前期差":fs(dl(pl.sga,2))+"百万円","販管費率_推移":trR(sgr),"販管費率_動き":rateW(sgr),
 "材料費率_推移":MC?trR(cr):"xx","材料費率_動き":MC?rateW(cr):"xx",
 "売上100円の原価_推移":trY(cgr),"売上100円の材料費_推移":MC?trY(cr):"xx","売上100円の材料費_2期差":MC?f1s(cr[2]-cr[0])+"円":"xx","売上100円の利益_推移":trY(orr),"売上100円の利益_当期":f1(orr[2])+"円",
 "人件費_当期":fm(pers(2))+"百万円","人件費率_推移":trR(I3.map(i=>pers(i)/S[i]*100)),
 "現預金_当期":fm(bs.cash[2])+"百万円","現預金_前期差":fs(dl(bs.cash,2))+"百万円","現預金_推移":trM(bs.cash),"現預金_動き":amtW(bs.cash),
 "営業CF_当期":fs(CFS[2].ocf)+"百万円","営業CF_前期":fs(CFS[1].ocf)+"百万円","投資CF_当期":fs(CFS[2].icf)+"百万円","財務CF_当期":fs(CFS[2].fcf)+"百万円",
 "売掛金と在庫の増加_当期":fm(dl(bs.ar,2)+dl(bs.inv,2))+"百万円",
 "売掛金_当期":fm(bs.ar[2])+"百万円","売掛金_前期差":fs(dl(bs.ar,2))+"百万円","売掛金回転_推移":trT(at),"売掛金回転_当期":f1(at[2])+"か月","売掛金回転_動き":turnW(at),
 "棚卸資産_当期":fm(bs.inv[2])+"百万円","棚卸資産_前期差":fs(dl(bs.inv,2))+"百万円","棚卸資産回転_推移":trT(it),"棚卸資産回転_動き":turnW(it),
 "借入金_当期":fm(debt[2])+"百万円","借入金_前期差":fs(dl(debt,2))+"百万円","借入金_推移":trM(debt),"長期借入金_前期差":fs(dl(bs.ltl,2))+"百万円","短期借入金_前期差":fs(dl(bs.stl,2))+"百万円",
 "自己資本比率_当期":pc(er[2]),"自己資本比率_前期":pc(er[1]),"自己資本比率_前々期":pc(er[0]),"自己資本比率_推移":trR(er),"自己資本比率_動き":rateW(er),
 "総資産_当期":fm(bs.ta[2])+"百万円","総資産_2期増減率":f1s((bs.ta[2]/bs.ta[0]-1)*100)+"%"};
const TX=KS.text||{};
function fill(str,where,max,dig){if(str==null)return"";str=String(str);
 const bare=str.replace(/\{[^{}]*\}/g,"").replace(/売上100円|3期|1ポイント/g,"");
 if(!dig&&/[0-9０-９]/.test(bare))warn("要修正",`${where}：数字が直接書かれています（差し込み記号を使ってください）「${str.slice(0,40)}」`);
 if(/続け|続い|続く|保っ|保ち|保つ|維持|一貫|横ばい/.test(bare))warn("要確認",`${where}：傾向の言葉は {…_動き} の記号で書いてください「${str.slice(0,40)}」`);
 const out=str.replace(/\{([^{}]*)\}/g,(m,k)=>{if(k in TOK){if(TOK[k]==="xx")warn("要修正",`${where}：{${k}} はこの決算書では使えません`);return TOK[k]}warn("要修正",`${where}：知らない差し込み記号 {${k}}`);return"xx"});
 if(max&&out.replace(/\|/g,"").length>max)warn("要確認",`${where}：${max}字を超えています（${out.replace(/\|/g,"").length}字）「${out.replace(/\|/g,"").slice(0,40)}」`);
 return out}
const ftx=(s,w,mx)=>esc(fill(s,w,mx));
/* ---------- 論点の種類（数字と根拠は固定プログラムが出す） ---------- */
const ISSUE_TYPES={
 cost_rate:{card:"cost",ask:"cost"},gp_rate:{card:"cost",ask:"cost"},sga_rate:{card:"op",ask:"sga"},
 ar_turn:{card:"ar",ask:"ar"},inv_turn:{card:null,ask:"inv"},debt:{card:"cash",ask:"debt"}};
const ISS=(Array.isArray(TX.issues)?TX.issues:[]).slice(0,3).map((x,i)=>{const ty=ISSUE_TYPES[x&&x.type]?x.type:null;if(!ty)warn("要修正",`論点${NUM[i]}：type が「${x&&x.type}」です（cost_rate・gp_rate・sga_rate・ar_turn・inv_turn・debt から選ぶ）`);
 return{t:fill(x&&x.t,`論点${NUM[i]}の題`,16),type:ty||"gp_rate",why:fill(x&&x.why,`論点${NUM[i]}の説明`,60)}});
if(!ISS.length){warn("要修正","論点（issues）がありません");ISS.push({t:"来期の利益の見通し",type:"gp_rate",why:""})}
const SECN=[null,"全体像","売上と利益","利益の増減","原価の中身","財務体質","お金の流れ","来期への論点"];
const SRC=[null,`出所：${PD[0]}〜${PD[2]} 損益計算書・貸借対照表`,`出所：${PD[0]}〜${PD[2]} 損益計算書`,`出所：${PD[0]}〜${PD[2]} 損益計算書${MC?"・製造原価報告書":""}`,`出所：${PD[0]}〜${PD[2]} 損益計算書${MC?"・製造原価報告書":""}`,`出所：${PD[0]}〜${PD[2]} 貸借対照表・損益計算書`,`出所：${PD[0]}〜${PD[2]} 貸借対照表・損益計算書${MC?"・製造原価報告書":""}${capexIn.some(v=>v!=null)?"、状況メモ（設備投資額）":""}`,`出所：${PD[0]}〜${PD[2]} 損益計算書・貸借対照表（試算は当期の費用構造から計算）`];
const TH=TX.heads||{};
const HEAD=[null,...[1,2,3,4,5,6,7].map(n=>{let h=fill(TH[n]||TH[String(n)],`${n}ページの見出し`,0);if(!h){warn("要修正",`${n}ページの見出しがありません`);h=SECN[n]}return{s:SECN[n],h:esc(h),src:SRC[n]}})];
const COVER=ftx(TX.cover,"表紙の結論",0)||"決算のご報告";
const TC=TX.cards||{};
/* ---------- 動きの道具 ---------- */
let STATIC=false,RUN=0,cur=0,DEMO=false,SELd=null;
const EO=p=>1-Math.pow(1-p,3),EQ=p=>1-Math.pow(1-p,4),LIN=p=>p;
function bz(x1,y1,x2,y2){const A=(a,b)=>1-3*b+3*a,B=(a,b)=>3*b-6*a,C=a=>3*a,cv=(t,a,b)=>((A(a,b)*t+B(a,b))*t+C(a))*t;
 return x=>{let t=x;for(let i=0;i<8;i++){const e=cv(t,x1,x2)-x,d=(3*A(x1,x2)*t+2*B(x1,x2))*t+C(x1);if(Math.abs(d)<1e-6)break;t-=e/d}return cv(t,y1,y2)}}
const EB=bz(.2,.9,.3,1.15);
function loop(dur,delay,ease,fn,ok){if(STATIC||dur<=0){fn(1);return}const t0=performance.now()+delay,g=RUN;
 const f=t=>{if(ok&&!ok())return;if(g!==RUN){fn(1);return}let p=(t-t0)/dur;if(p<0){requestAnimationFrame(f);return}if(p>1)p=1;fn(ease(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function st(e,o){for(const k in o)e.setAttribute(k,o[k]);e._a=Object.assign(e._a||{},o);return e}
function mv(e,to,dur=800,delay=0,ease=EO){const fr=Object.assign({},e._a),tk={};e._tk=tk;for(const k in to)if(fr[k]==null)fr[k]=to[k];
 loop(dur,delay,ease,p=>{const c={};for(const k in to){c[k]=fr[k]+(to[k]-fr[k])*p;if(k==="height"||k==="width")c[k]=Math.max(0,c[k])}st(e,c)},()=>e._tk===tk)}
function cnt(e,to,fmt,dur=1200,delay=0){const fr=e._n??0,tk={};e._ct=tk;loop(dur,delay,EQ,p=>{const v=fr+(to-fr)*p;e._n=v;e.textContent=fmt(v)},()=>e._ct===tk)}
function T(d,fn){if(STATIC){fn();return}const g=RUN;setTimeout(()=>{if(g===RUN)fn()},d)}
function glow(e){e.classList.remove("glow");void e.getBBox;requestAnimationFrame(()=>e.classList.add("glow"));setTimeout(()=>e.classList.remove("glow"),1300)}
function ping(e){if(!e||STATIC)return;e.classList.remove("ping");void e.offsetWidth;e.classList.add("ping");setTimeout(()=>e.classList.remove("ping"),1400)}
function lines(t,s){t.textContent="";const a=s.split("\n");a.forEach((x,i)=>E("tspan",{x:t.getAttribute("x"),dy:i?22:0},t,x))}
function callout(p,x,y,txt){const g=E("g",{class:"co"},p),t=E("text",{x,y,"text-anchor":"middle"},g,txt);const w=txt.length*19+28;E("rect",{x:x-w/2,y:y-27,width:w,height:38,rx:6},g);g.appendChild(t);
 T(30,()=>g.classList.add("on"));setTimeout(()=>{g.classList.remove("on");setTimeout(()=>g.remove(),400)},STATIC?0:2200);return g}
function mkLine(g,pts,o){const pl_=E("polyline",{points:pts.map(p=>p.join(",")).join(" "),fill:"none",stroke:o.c,"stroke-width":o.w||3,"stroke-linejoin":"round"},g);
 let L=0;const cum=[0];for(let i=1;i<pts.length;i++){L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);cum.push(L)}
 pl_.style.strokeDasharray=L;const dots=pts.map((p,i)=>{const d=E("circle",{cx:p[0],cy:p[1],r:o.r||6,fill:o.c,class:"dot"+(o.ck?" hov ck":"")},g);if(o.ck)o.ck(d,i);return d});
 const labs=(o.lab||[]).map((t,i)=>E("text",{x:pts[i][0],y:pts[i][1]+(o.dy||-16),"text-anchor":"middle",class:(o.lc||"vl")+" dot"},g,t));return{pl:pl_,dots,labs,L,cum}}
function lineIn(o,delay=0,dur=1000){o.pl.style.strokeDashoffset=o.L;[...o.dots,...o.labs].forEach(d=>d.style.opacity=0);
 loop(dur,delay,LIN,p=>{o.pl.style.strokeDashoffset=o.L*(1-p);o.cum.forEach((c,i)=>{if(c<=p*o.L+.5){o.dots[i].style.opacity=1;if(o.labs[i])o.labs[i].style.opacity=1}})})}
function tip(e,s){e.setAttribute("data-tip",s)}
function pk(e,k){e.setAttribute("data-pk",k);return e}
/* ---------- 見出しと枠 ---------- */
const secs=$$("section"),NP=secs.length,PG=[];
function frame(n){const h=HEAD[n],s=secs[n];let d=-60;
 s.innerHTML=`<div class="sec rv" data-d="0">${h.s}</div><h2>${h.h.split("|").map(x=>`<span class="rv" data-d="${d+=260}">${x}</span>`).join("")}</h2><div class="body"></div><div class="src rv" data-d="900">${h.src}</div>`;return $(".body",s)}
function head(n){const s=secs[n];$$(".rv",s).forEach(e=>{e.classList.remove("in");T(+e.dataset.d||0,()=>e.classList.add("in"))})}
function seg(id,opts,on,cb){const w=$(id);w.innerHTML=opts.map(([v,l])=>`<button data-v="${v}" class="${v==on?"on":""}">${l}</button>`).join("");
 w.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;$$("button",w).forEach(x=>x.classList.toggle("on",x===b));cb(b.dataset.v)})}
/* ---------- 滝グラフ（マイナスにも対応） ---------- */
const runRange=ds=>{let mx=0,mn=0;ds.forEach(d=>{let r=d.start;mx=Math.max(mx,r,d.end);mn=Math.min(mn,r,d.end);d.st.forEach(x=>{r+=x.v;mx=Math.max(mx,r);mn=Math.min(mn,r)})});const pad=(mx-mn)*.08||1;return{max:mx+pad,min:mn<0?mn-pad:0}};
function WF(svg,o){const{W,H,n,max,min}=o,top=100,bot=118,slot=W/n,bw=Math.min(74,slot*.64),g=E("g",{},svg),sc=v=>H-bot-((v-min)/(max-min))*(H-top-bot);
 E("line",{x1:0,x2:W,y1:sc(0),y2:sc(0),class:"ax"},g);const w={svg,g,sc,slot,bw,n,H,bot,bars:[],vals:[],nms:[],cons:[],cur:null};
 for(let i=0;i<n;i++){const cx=i*slot+slot/2;if(i<n-1)w.cons.push(st(E("line",{class:"con"},g),{opacity:0}));
  w.bars.push(st(E("rect",{class:"hov ck",rx:2},g),{x:cx-bw/2,y:sc(0),width:bw,height:0,opacity:1}));
  w.vals.push(st(E("text",{x:cx,class:"vl","text-anchor":"middle"},g),{opacity:0}));w.nms.push(E("text",{x:cx,y:H-bot+30,class:"nm","text-anchor":"middle"},g))}
 const id="c"+Math.random().toString(36).slice(2);w.clip=st(E("rect",{x:0,y:0,height:H},E("clipPath",{id},g)),{width:0});w.link=E("path",{class:"link","clip-path":`url(#${id})`},g);w.lt=E("text",{y:28,class:"nm","text-anchor":"middle",style:"font-weight:700"},g);return w}
function wfSet(w,d,mode,kf,tf){const it_=[{k:"start",l:d.sl,v:d.start,t:"s"},...d.st.map(x=>({...x,t:"d"})),{k:"end",l:d.el,v:d.end,t:"e"}];
 let run=0;const old=w.cur;w.cur=it_;const Bd=mode==="build",Mo=mode==="morph";
 w.bars.forEach((r,i)=>{const on=i<it_.length;r.style.display=on?"":"none";w.vals[i].style.display=on?"":"none";w.nms[i].style.display=on?"":"none";if(w.cons[i])w.cons[i].style.display=i<it_.length-1?"":"none"});
 it_.forEach((x,i)=>{let a,b;if(x.t==="s"){a=0;b=x.v;run=x.v}else if(x.t==="e"){a=0;b=x.v}else{a=run;b=run+x.v;run=b}
  const top=w.sc(Math.max(a,b)),h=Math.max(2,Math.abs(w.sc(a)-w.sc(b))),r=w.bars[i],v=w.vals[i],cx=i*w.slot+w.slot/2,vy=top-12;
  r.setAttribute("fill",x.t==="s"?"#A9C6E8":x.t==="e"?"#1F5FA8":x.v>=0?"#6F9CD3":"#5B6670");pk(r,kf(x.k));tip(r,tf(x));
  v.classList.toggle("neg",x.v<0);const fmt=x.t==="d"?fs:fm;lines(w.nms[i],x.l);
  if(Bd){const dl_=x.t==="s"?0:x.t==="e"?600+it_.length*170:500+i*170;
   if(x.t==="d"){st(r,{y:top-60,height:h,opacity:0});mv(r,{y:top,opacity:1},420,dl_,EB)}else{st(r,{y:w.sc(0),height:0,opacity:1});mv(r,{y:top,height:h},700,dl_,EB)}
   st(v,{y:vy,opacity:0});v._n=0;mv(v,{opacity:1},300,dl_+250);cnt(v,x.v,fmt,700,dl_+250)}
  else if(Mo){mv(r,{y:top,height:h,opacity:1},800);mv(v,{y:vy,opacity:1},800);cnt(v,x.v,fmt,800);if(old&&old[i]&&x.v>old[i].v+1)T(820,()=>glow(r))}
  else{st(r,{y:top,height:h,opacity:1});st(v,{y:vy,opacity:1});v._n=x.v;v.textContent=fmt(x.v)}
  if(i<it_.length-1){const c=w.cons[i],y=w.sc(x.t==="e"?x.v:run);const to={x1:cx+w.bw/2,x2:cx+w.slot-w.bw/2,y1:y,y2:y};
   if(Bd){st(c,{...to,opacity:0});mv(c,{opacity:1},300,500+(i+1)*170)}else if(Mo)mv(c,{...to,opacity:1},800);else st(c,{...to,opacity:1})}});
 const x1=w.slot/2,x2=(it_.length-1)*w.slot+w.slot/2,ly=44;w.link.setAttribute("d",`M${x1},${w.sc(Math.max(0,d.start))-40} V${ly} H${x2} V${w.sc(Math.max(0,d.end))-40}`);w.lt.setAttribute("x",(x1+x2)/2);w.lt.textContent=`起点→終点 ${fs(d.end-d.start)}`;
 if(Bd){st(w.clip,{width:0});w.lt.style.opacity=0;const t0=700+it_.length*170;mv(w.clip,{width:x2+10},700,t0,LIN);T(t0+600,()=>w.lt.style.opacity=1)}else{st(w.clip,{width:x2+10});w.lt.style.opacity=1;if(Mo)glow(w.link)}}
/* ---------- 表紙 ---------- */
PG[0]={build(){const s=secs[0];s.classList.add("cover");
 const rg=RG?`（${RG[0].split("〜")[0]}〜${(RG[2].split("〜")[1]||"")}）`:"";
 s.innerHTML=`<div class="cv-n rv" data-d="0">${esc(NAME)}</div><div class="cv-t rv" data-d="150">${esc(PD[2])} 決算のご報告</div><div class="cv-p rv" data-d="300">対象期間：${esc(PD[0])}〜${esc(PD[2])}${esc(rg)}</div><svg class="cv-g" width="1744" height="290" viewBox="0 0 1744 290"></svg><div class="cv-c rv" data-d="2700">${COVER}</div><div class="cv-h rv" data-d="3100">クリックか → キーで始めます</div>`;
 const g=$("svg",s),mx=Math.max(...S)*1.1,xs=[200,872,1544],pts=S.map((v,i)=>[xs[i],282-Math.max(0,v)/mx*250]);
 this.L=mkLine(g,pts,{c:"#fff",w:3,r:7,lab:S.map((v,i)=>`${PD[i]}　${fm(v)}`),lc:"cv-l",dy:-24});
 E("text",{x:1580,y:pts[2][1]+8,class:"cv-u"},g,"売上高（百万円）")},
 enter(){head(0);lineIn(this.L,700,1700)}};
/* ---------- 1 全体像 ---------- */
const cardOf=c=>ISS.findIndex(x=>ISSUE_TYPES[x.type].card===c);
PG[1]={build(){const b=frame(1),c=CFS[2];
 const K=[{k:"k-sales",l:`売上高（${PD[2]}）`,a:S},{k:"k-op",l:`営業利益（${PD[2]}）`,a:pl.op},{k:"k-cash",l:`現預金（${PD[2]}末）`,a:bs.cash}];
 const p1=per(1);
 const CD=[
  {c:"sales",t:"売上高",d:fs(S[2]-S[1]),u:"百万円",f:`${fm(S[1])}→${fm(S[2])}（${f1s(g2)}%）`,go:2},
  {c:"op",t:"営業利益",d:fs(pl.op[2]-pl.op[1]),u:"百万円",f:[`売上${fs(PWS[1].st[0].v)}`,`原価${fs(PWS[1].st[1].v)}`,`販管費${fs(-(pl.sga[2]-pl.sga[1]))}`].map(x=>`<span class="nw">${x}</span>`).join(" "),go:3},
  {c:"cost",t:MC?"売上100円の材料費":"売上100円の売上原価",d:f1s(P2.mat-p1.mat),u:"円",f:`${f1(p1.mat)}円→${f1(P2.mat)}円`,go:4},
  {c:"ar",t:"売掛金",d:fs(dl(bs.ar,2)),u:"百万円",f:`回転 ${f1(arM(1))}→${f1(arM(2))}か月`,go:5},
  {c:"cash",t:"現預金",d:fs(dl(bs.cash,2)),u:"百万円",f:[`営業CF${fs(c.ocf)}`,`投資${fs(c.icf)}`,`財務${fs(c.fcf)}`,...(c.gap?[`その他${fs(c.gap)}`]:[])].map(x=>`<span class="nw">${x}</span>`).join(" "),go:6}];
 CD.forEach(x=>{x.s=ftx(TC[x.c],`カード「${x.t}」の一言`,0);x.tg=cardOf(x.c)});
 b.innerHTML=`<div class="kpis">${K.map((k,i)=>`<div class="kpi rv ck" data-d="${600+i*150}" data-pk="${k.k}" tabindex="0"><div class="kl">${k.l}<span class="hint">押すと内訳 ›</span></div><div class="kv"><span class="big">0.0</span><span class="ku">百万円</span></div><div class="kr"><svg width="330" height="92" viewBox="0 0 330 92"></svg><div><div class="kdl">前期差</div><div class="kdv ${dl(k.a,2)<0?"neg":""}">${fs(dl(k.a,2))}</div></div></div></div>`).join("")}</div>
 <div class="cards">${CD.map((x,i)=>`<div class="card rv" data-d="${1500+i*260}" data-go="${x.go}" tabindex="0"><div class="ct">${x.t}</div><div class="cd ${x.d.startsWith("▲")?"neg":""}">${x.d}<small>${x.u}</small></div><div class="cf">${x.f}</div><div class="cs">${x.s}</div><div class="cg">${x.tg>=0?`<b class="tg">論点${NUM[x.tg]}</b>`:"<span></span>"}<span>p.${x.go} ›</span></div></div>`).join("")}</div>
 <svg class="arw" width="1744" height="330" viewBox="0 0 1744 330"></svg>
 <div class="issues rv" data-d="2700"><span class="il">来期に決めていただきたいこと</span>${ISS.map((t,i)=>`<span class="iss ck" data-pk="q${i+1}" tabindex="0"><b class="ib">${NUM[i]}</b>${esc(t.t)}</span>`).join("")}<span class="hint" style="margin-left:auto">押すと内訳 ›</span></div>`;
 this.K=K;this.sp=$$(".kpi svg",b).map((g,j)=>{const a=K[j].a,mx=Math.max(...a.map(Math.abs))*1.05||1,mn=Math.min(0,...a),pts=a.map((v,i)=>[30+i*135,88-(v-mn)/(mx-mn)*58]);
  return mkLine(g,pts,{c:j===1?"#5B6670":"#1F5FA8",w:2.5,r:5,lab:a.map(fm),lc:"nt",dy:-12})});
 const ag=$(".arw",b);this.ar=[0,1,2,3].map(i=>{const x=(i+1)*304+i*56;const l=E("line",{x1:x+8,x2:x+8,y1:165,y2:165,stroke:"#1F5FA8","stroke-width":3},ag);st(l,{x2:x+8});const h=E("path",{d:`M${x+38},157 L${x+48},165 L${x+38},173`,fill:"none",stroke:"#1F5FA8","stroke-width":3,opacity:0},ag);return{l,h,x}})},
 enter(){head(1);const s=secs[1];$$(".big",s).forEach((e,j)=>{e._n=0;e.classList.toggle("neg",this.K[j].a[2]<0);cnt(e,this.K[j].a[2],fm,1200,700+j*150)});
 this.sp.forEach((o,j)=>lineIn(o,900+j*150,800));
 this.ar.forEach((a,i)=>{st(a.l,{x2:a.x+8});a.h.style.opacity=0;mv(a.l,{x2:a.x+46},300,1500+(i+1)*260-60);T(1500+(i+1)*260+200,()=>a.h.style.opacity=1)});
 T(3100,()=>{$$(".ib,.tg",s).forEach(ping)})}};
/* ---------- 2 売上と利益 ---------- */
PG[2]={m:"sales",build(){const b=frame(2);
 b.innerHTML=`<div class="lc" style="width:1150px"><div class="tr rv" data-d="900"><span class="ttl">3期の売上と利益（棒：百万円、線：売上高に対する率）</span><span class="hint">棒・点を押すと内訳 ›</span></div><div class="ctl rv" data-d="900"><div class="seg" id="m2"></div><button class="play" id="pl2">再生（${PD[0]}→${PD[2]}）</button></div><svg id="g2" width="1150" height="662" viewBox="0 0 1150 662"></svg></div><div class="rc box rv" data-d="2300" style="width:552px"><div class="bt">言えること</div><div class="bs">${ftx(TX.say2,"売上と利益の「言えること」",110)}</div><table class="tb roomy" id="t2"></table><div class="note">行を押すと内訳と計算式が出ます。</div></div>`;
 seg("#m2",[["sales","売上"],["gp","売上総利益"],["op","営業利益"]],"sales",v=>this.set(v,"morph"));$("#pl2").onclick=()=>this.play();
 const g=$("#g2"),xs=[218,535,852];this.xs=xs;this.top=330;this.bot=600;
 E("line",{x1:40,x2:1010,y1:272,y2:272,stroke:"#D9E1EA"},g);
 const SR=[{k:"gp",l:"売上総利益率",a:gr,c:"#6F9CD3",y0:40},{k:"op",l:"営業利益率",a:orr,c:"#0E2A47",y0:160}];
 this.ln=SR.map(s=>{const lo=Math.min(...s.a)-1,hi=Math.max(...s.a)+1,pts=s.a.map((v,i)=>[xs[i],s.y0+70-(v-lo)/(hi-lo)*70]);
  const o=mkLine(g,pts,{c:s.c,w:3,r:7,lab:s.a.map(pc),dy:-16,ck:(d,i)=>{pk(d,"rt-"+s.k);tip(d,`${PD[i]} ${s.l}：${pc(s.a[i])}${i?`｜前期との差 ${f1s(s.a[i]-s.a[i-1])}ポイント`:""}`)}});
  E("text",{x:xs[2]+28,y:pts[2][1]+7,class:"nm",style:"font-weight:700"},g,s.l);return o});
 this.axis=E("line",{x1:40,x2:1010,y1:600,y2:600,class:"ax"},g);
 this.bars=xs.map((x,i)=>st(E("rect",{class:"hov ck",fill:i===2?"#1F5FA8":"#A9C6E8",rx:2},g),{x:x-85,y:600,width:170,height:0}));
 this.vals=xs.map(x=>E("text",{x,class:"vl","text-anchor":"middle"},g));xs.forEach((x,i)=>E("text",{x,y:636,class:"nm","text-anchor":"middle",style:"font-size:22px"},g,PD[i]));
 this.cg=E("g",{},g);
 const Rw=[["sales","売上高",S,fm],["gsr","売上高の前期比",[NaN,(S[1]/S[0]-1)*100,g2],v=>nul(v)?"":f1s(v)+"%"],["gp","売上総利益",pl.gp,fm],["op","営業利益",pl.op,fm],["gpr","売上総利益率",gr,pc],["opr","営業利益率",orr,pc]];
 $("#t2").innerHTML=`<tr><th>百万円・%</th>${PD.map(p=>`<th>${esc(p)}</th>`).join("")}</tr>`+Rw.map(r=>`<tr class="ck" data-pk="${r[0]==="gsr"?"pl-sales":r[0].endsWith("r")?"rt-"+r[0].slice(0,2):"pl-"+r[0]}" data-r="${r[0]}"><td>${r[1]}</td>${r[2].map((v,i)=>`<td class="${i===2?"c":""}">${r[3](v)}</td>`).join("")}</tr>`).join("")},
 dom(a){const hi=Math.max(0,...a)*1.12||1,lo=Math.min(0,...a)*1.12;return{hi,lo,z:this.bot-(0-lo)/(hi-lo)*(this.bot-this.top)}},
 geo(v,D){const y=this.bot-(v-D.lo)/(D.hi-D.lo)*(this.bot-this.top);return{y:Math.min(y,D.z),height:Math.abs(D.z-y)}},
 vy(v,G){return v<0?G.y+G.height+30:G.y-14},
 set(m,mode){this.m=m;const a=m==="sales"?S:pl[m],D=this.dom(a),L=m==="sales"?"売上高":LB[m];this.D=D;
  st(this.axis,{y1:D.z,y2:D.z});
  $$("#t2 tr[data-r]").forEach(r=>r.classList.toggle("hl",r.dataset.r===m));
  this.bars.forEach((r,i)=>{const G=this.geo(a[i],D),v=this.vals[i];pk(r,"pl-"+m);tip(r,`${PD[i]} ${L}：${fm(a[i])}百万円${i?`｜前期との差 ${fs(a[i]-a[i-1])}`:""}`);v.classList.toggle("neg",a[i]<0);
   if(mode==="build"){st(r,{y:D.z,height:0});mv(r,G,800,1000+i*80,EB);st(v,{y:this.vy(a[i],G)});v._n=0;cnt(v,a[i],fm,1000,1100+i*80)}
   else{const up=mode==="morph"&&r._a.height<G.height-1;mv(r,G,800);mv(v,{y:this.vy(a[i],G)},800);cnt(v,a[i],fm,800);if(up)T(820,()=>glow(r))}})},
 play(){const m=this.m,a=m==="sales"?S:pl[m],D=this.dom(a),L=m==="sales"?"売上":LB[m];
  this.bars.forEach((r,i)=>{if(i){mv(r,{y:D.z,height:0},300);cnt(this.vals[i],0,fm,300)}});
  [1,2].forEach(i=>T(450+(i-1)*1200,()=>{const Pv=this.geo(a[i-1],D),G=this.geo(a[i],D);st(this.bars[i],Pv);this.vals[i]._n=a[i-1];
   mv(this.bars[i],G,800,0,EB);mv(this.vals[i],{y:this.vy(a[i],G)},800);cnt(this.vals[i],a[i],fm,800);
   T(600,()=>callout(this.cg,this.xs[i],Math.max(70,G.y-62),`${L} ${fs(a[i]-a[i-1])}${a[i-1]>0?`（${f1s((a[i]/a[i-1]-1)*100)}%）`:""}`))}))},
 enter(){head(2);this.set(this.m,"build");this.ln.forEach((o,j)=>lineIn(o,1300+j*250,900));T(3000,()=>ping($("#m2")))}};
/* ---------- 3 利益の増減 ---------- */
PG[3]={pi:1,build(){const b=frame(3);
 b.innerHTML=`<div class="lc" style="width:1090px"><div class="tr rv" data-d="900"><span class="ttl">営業利益の増減（単位：百万円）</span><span class="hint">段を押すと内訳 ›</span></div><div class="ctl rv" data-d="900"><div class="seg" id="m3"></div></div><svg id="g3" width="1090" height="662" viewBox="0 0 1090 662"></svg></div><div class="rc box rv" data-d="2600" style="width:610px"><div class="bt">根拠</div><div class="bs" id="say3"></div><table class="tb" id="t3"></table><div class="chk" id="c3"></div></div>`;
 seg("#m3",[[0,`${PD[0]}→${PD[1]}`],[1,`${PD[1]}→${PD[2]}`]],1,v=>{this.pi=+v;this.set("morph")});
 const R=runRange(PWS);this.W=WF($("#g3"),{W:1090,H:662,n:Math.max(...PWS.map(d=>d.st.length))+2,max:R.max,min:R.min})},
 set(mode){const d=PWS[this.pi];wfSet(this.W,d,mode,k=>"pw-"+k,x=>x.t==="d"?`${x.l.replace("\n","")}：${fs(x.v)}百万円（営業利益への影響）`:`${x.l.replace("\n"," ")}：${fm(x.v)}百万円`);
  const sg=sum(d.st.filter(x=>x.k!=="sales"&&x.k!=="cogs"&&x.k!=="gap").map(x=>x.v));
  $("#say3").textContent=`売上高が${fm(Math.abs(d.st[0].v))}百万円${d.st[0].v>=0?"増え":"減り"}、売上原価は${fm(Math.abs(d.st[1].v))}百万円${d.st[1].v<=0?"増え":"減り"}、販管費は${fm(Math.abs(sg))}百万円${sg<=0?"増え":"減り"}ました。営業利益は${fs(d.end-d.start)}百万円です。`;
  const rows=[["start",`${PD[d.a]}の営業利益`,d.start,fm],...d.st.map(x=>[x.k,x.l,x.v,fs]),["end",`${PD[d.b]}の営業利益`,d.end,fm]];
  $("#t3").innerHTML=`<tr><th>段（百万円）</th><th>金額</th></tr>`+rows.map(r=>`<tr class="ck${r[0]==="start"||r[0]==="end"?" hl":""}" data-pk="pw-${r[0]}"><td>${esc(r[1])}</td><td class="${r[2]<0?"neg":""}">${r[3](r[2])}</td></tr>`).join("");
  const ok=d.start+sum(d.st.map(x=>x.v))===d.end;
  $("#c3").textContent=`起点 ${fy(d.start)}円 ＋ 各段の合計 ${fy(sum(d.st.map(x=>x.v)))}円 ＝ 終点 ${fy(d.end)}円（${ok?"円単位で一致":"不一致"}）`},
 enter(){head(3);this.set("build");T(3000,()=>ping($("#m3")))}};
/* ---------- 4 原価の中身 ---------- */
const SEG=MC?[["mat","材料","#1F5FA8","#fff"],["out","外注","#6F9CD3","#0E2A47"],["labor","労務","#C4CCD5","#1C2430"],["exp","経費・在庫","#D5DCE3","#1C2430"],["sga","販管費","#E6EAEF","#1C2430"],["op","利益","#A9C6E8","#0E2A47"]]
 :[["mat","売上原価","#1F5FA8","#fff"],["sga","販管費","#E6EAEF","#1C2430"],["op","利益","#A9C6E8","#0E2A47"]];
const segW=v=>Math.max(0,v);
PG[4]={build(){const b=frame(4);
 const lossNote=I3.some(i=>pl.op[i]<0)?"営業利益がマイナスの期は、利益の帯を0として描いています（費用の合計が100円を超えます）。":"";
 b.innerHTML=`<div class="tr rv" data-d="900" style="justify-content:space-between"><span><span class="ttl">売上100円の使い道（単位：円）</span>　<span class="hint">帯を押すと内訳 ›</span></span><button class="play" id="pl4">再生（${PD[0]}→${PD[2]}）</button></div><svg id="g4" width="1744" height="590" viewBox="0 0 1744 590" style="margin-top:12px"></svg><div class="box rv" data-d="2500" style="padding:18px 30px;margin-top:8px"><table class="tb"><tr class="ck" data-pk="c-pers"><td>人件費（${PERS.some(v=>v)?"販管費の人件費":""}${MC&&mc.labor.some(v=>v)?"＋製造労務費":""}）売上100円あたり</td>${PD.map((p,i)=>`<td>${esc(p)} <b>${f1(pers(i)/S[i]*100)}円</b></td>`).join("")}</tr></table><div class="note" style="margin-top:6px">${MC?"経費・在庫＝製造経費＋在庫の増減ほか（売上原価−材料費−外注加工費−労務費）。":""}帯の合計は100円です。${lossNote}</div></div>`;
 $("#pl4").onclick=()=>this.play();const g=$("#g4");this.X0=150;
 const tot=i=>sum(SEG.map(s=>segW(per(i)[s[0]])));this.BW=1594/Math.max(100,...I3.map(tot))*100;
 this.nm=SEG.map(s=>E("text",{y:44,class:"nm","text-anchor":"middle",style:"font-weight:700;font-size:20px"},g,s[1]));
 this.rows=[0,1,2].map(r=>{const y=70+r*185,lab=E("text",{x:0,y:y+76,class:"nm",style:"font-size:24px;font-weight:700"},g,PD[r]);
  const sg=SEG.map(s=>{const rc=st(E("rect",{fill:s[2],class:"hov ck",stroke:"#fff","stroke-width":2},g),{x:150,y,width:0,height:130});pk(rc,"c-"+s[0]);
   const t=st(E("text",{y:y+73,"text-anchor":"middle",class:"vl",style:`fill:${s[3]}`},g),{x:150,opacity:1});return{rc,t}});return{y,lab,sg,cg:E("g",{},g)}})},
 setRow(r,i,dur,delay=0,mode){const p=per(i),R=this.rows[r];let x=this.X0;R.lab.textContent=PD[i];const old=R.i;R.i=i;
  SEG.forEach(([k,l],j)=>{const w=segW(p[k])/100*this.BW,s=R.sg[j];tip(s.rc,`${PD[i]} ${l}：売上100円あたり ${f1(p[k])}円${i?`｜前期との差 ${f1s(p[k]-per(i-1)[k])}円`:""}`);s.rc.setAttribute("data-i",i);
   if(mode==="build"){st(s.rc,{x:this.X0,width:0});st(s.t,{x:this.X0,opacity:0});s.t._n=0}
   mv(s.rc,{x,width:w},dur,delay,EO);mv(s.t,{x:x+w/2,opacity:w>44?1:0},dur,delay,EO);cnt(s.t,p[k],f1,dur,delay);
   if(r===2)mv(this.nm[j],{x:x+w/2,opacity:w>30?1:0},dur,delay,EO);if(mode==="play"&&old!=null&&p[k]>per(old)[k]+.05)T(delay+dur,()=>glow(s.rc));x+=w})},
 play(){[0,1,2].forEach(r=>this.setRow(r,0,500));
  [1,2].forEach(i=>T(600+(i-1)*1200,()=>{for(let r=i;r<3;r++)this.setRow(r,i,900,0,"play");
   const a=per(i-1),b=per(i),top=SEG.map(([k,l],j)=>({k,l,j,d:b[k]-a[k]})).sort((x,y)=>Math.abs(y.d)-Math.abs(x.d)).slice(0,2),R=this.rows[i];
   T(950,()=>top.forEach(t=>{let x=this.X0;for(let j=0;j<t.j;j++)x+=segW(b[SEG[j][0]])/100*this.BW;const w=segW(b[t.k])/100*this.BW;callout(R.cg,x+w/2,R.y-14,`${t.l} ${f1s(t.d)}円`)}))}))},
 enter(){head(4);[0,1,2].forEach(r=>this.setRow(r,r,900,1000+r*80,"build"));T(3000,()=>ping($("#pl4")))}};
/* ---------- 5 財務体質 ---------- */
const AS=[["cash","現預金",i=>bs.cash[i],"#D5DCE3"],["ar","売掛金",i=>bs.ar[i],"#1F5FA8"],["inv","棚卸資産",i=>bs.inv[i],"#E6EAEF"],["ppe","有形固定資産",i=>bs.ppe[i],"#C4CCD5"],["oth","その他の資産",i=>bs.oth[i],"#E6EAEF"]];
const LS=[["ap","買掛金",i=>bs.ap[i],"#D5DCE3"],["accr","未払金・その他の負債",i=>bs.acc2[i],"#E6EAEF"],["stl","短期借入金",i=>bs.stl[i],"#A9C6E8"],["ltl","長期借入金",i=>bs.ltl[i],"#A9C6E8"],["na","純資産",i=>bs.na[i],"#6F9CD3"]];
PG[5]={pi:2,build(){const b=frame(5);
 b.innerHTML=`<div class="lc" style="width:900px"><div class="tr rv" data-d="900"><span class="ttl">貸借対照表の面積図（単位：百万円）</span><span class="hint">面を押すと内訳 ›</span></div><div class="ctl rv" data-d="900"><div class="seg" id="m5"></div><button class="play" id="pl5">再生（${PD[0]}→${PD[2]}）</button></div><svg id="g5" width="900" height="662" viewBox="0 0 900 662"></svg></div><div class="rc box rv" data-d="2600" style="width:800px"><div class="bt">財務の指標</div><div class="bs">${ftx(TX.say5,"財務体質の「言えること」",80)||"面積図は3期とも同じ縮尺です。"}</div><table class="tb roomy" id="t5"></table><div class="note">回転（か月）＝期末残高÷（売上高÷12）。流動比率の流動負債には、1年内返済の長期借入金を含めていません（内訳が決算書に無いため）。</div></div>`;
 seg("#m5",PD.map((p,i)=>[i,esc(p)]),2,v=>{this.pi=+v;this.set("morph")});$("#pl5").onclick=()=>this.play();
 const g=$("#g5");this.base=612;this.H=540;this.mx=Math.max(...bs.ta,...bs.tle)||1;
 this.cols=[[AS,110],[LS,480]].map(([L,x])=>({x,it:L.map(s=>{const r=st(E("rect",{fill:s[3],class:"hov ck",stroke:"#fff","stroke-width":2},g),{x,y:this.base,width:330,height:0});pk(r,"b-"+s[0]);
  const dark=s[3]==="#1F5FA8";const t=st(E("text",{x:x+16,class:"nm",style:`fill:${dark?"#fff":"#1C2430"};font-weight:500`},g),{y:this.base,opacity:0});return{s,r,t}}),
  tot:st(E("text",{x:x+165,class:"vl","text-anchor":"middle"},g),{y:this.base,opacity:0})}));
 E("line",{x1:90,x2:830,y1:this.base,y2:this.base,class:"ax"},g);
 [["資産",275],["負債・純資産",645]].forEach(([t,x])=>E("text",{x,y:646,class:"nm","text-anchor":"middle",style:"font-size:22px;font-weight:700"},g,t));
 this.eq=st(E("line",{x1:96,x2:824,stroke:"#1F5FA8","stroke-width":3},g),{y1:0,y2:0,opacity:0});this.cg=E("g",{},g);
 const R=[["r-eq","自己資本比率",eqR,pc],["r-cur","流動比率",curR,pc],["r-ar","売掛金回転",arM,v=>f1(v)+"か月"],["r-inv","棚卸資産回転",invM,v=>f1(v)+"か月"],["r-debt","借入金（短期＋長期）",i=>debt[i],v=>fm(v)+"百万円"],["k-cash","現預金",i=>bs.cash[i],v=>fm(v)+"百万円"]];
 $("#t5").innerHTML=`<tr><th>指標</th>${PD.map(p=>`<th>${esc(p)}</th>`).join("")}</tr>`+R.map(r=>`<tr class="ck" data-pk="${r[0]}"><td>${r[1]}</td>${[0,1,2].map(i=>`<td data-i="${i}">${r[3](r[2](i))}</td>`).join("")}</tr>`).join("")},
 set(mode,dur=800){const i=this.pi;$$("#t5 td[data-i]").forEach(td=>td.classList.toggle("c",+td.dataset.i===i));const Bd=mode==="build";let topY=0;
  this.cols.forEach((c,ci)=>{let y=this.base;const old=c.it.map(x=>x.r._a.height);
   [...c.it].reverse().forEach((x,k)=>{const v=x.s[2](i),h=Math.max(0,v)/this.mx*this.H;y-=h;const yy=y;
    tip(x.r,`${PD[i]}末 ${x.s[1]}：${fm(v)}百万円${i?`｜前期との差 ${fs(v-x.s[2](i-1))}`:""}`);
    if(Bd){st(x.r,{y:yy+h,height:0});mv(x.r,{y:yy,height:h},500,1000+k*140,EO);st(x.t,{y:yy+h/2+7,opacity:0});
     T(1000+k*140+300,()=>{x.t.textContent=`${x.s[1]} ${fm(v)}`;mv(x.t,{opacity:h>=20?1:0},300)})}
    else{mv(x.r,{y:yy,height:h},dur);mv(x.t,{y:yy+h/2+7,opacity:h>=20?1:0},dur);x.t.textContent=`${x.s[1]} ${fm(v)}`;if(mode==="morph"&&h>old[c.it.indexOf(x)]+1)T(dur+20,()=>glow(x.r))}});
   topY=y;const tv=ci?bs.tle[i]:bs.ta[i];if(Bd){st(c.tot,{y:y-14,opacity:0});c.tot._n=0;mv(c.tot,{opacity:1},300,1900)}else mv(c.tot,{y:y-14,opacity:1},dur);
   const lab=ci?"負債・純資産":"資産",ov=Bd?0:(c.tot._v||0);c.tot._v=tv;loop(Bd?900:dur,Bd?1900:0,EQ,p=>{c.tot.textContent=`${lab}合計 ${fm(ov+(tv-ov)*p)}`})});
  const flash=()=>{st(this.eq,{y1:topY,y2:topY,opacity:1});mv(this.eq,{opacity:0},900,250)};T(Bd?2700:dur+50,flash)},
 play(){this.pi=0;this.set("x",500);$$("#m5 button").forEach((x,j)=>x.classList.toggle("on",j===0));
  [1,2].forEach(i=>T(700+(i-1)*1200,()=>{this.pi=i;$$("#m5 button").forEach((x,j)=>x.classList.toggle("on",j===i));this.set("morph");
   const ch=[...this.cols[0].it,...this.cols[1].it].map(x=>({x,d:x.s[2](i)-x.s[2](i-1)})).sort((a,b)=>Math.abs(b.d)-Math.abs(a.d)).slice(0,2);
   T(850,()=>ch.forEach(c=>{const a=c.x.r._a;callout(this.cg,a.x+165,a.y+a.height/2+2,`${c.x.s[1]} ${fs(c.d)}`)}))}))},
 enter(){head(5);this.set("build");T(3000,()=>ping($("#m5")))}};
/* ---------- 6 お金の流れ ---------- */
PG[6]={pi:2,build(){const b=frame(6);
 b.innerHTML=`<div class="lc" style="width:1090px"><div class="tr rv" data-d="900"><span class="ttl">現預金の増減（単位：百万円）</span><span class="hint">段を押すと内訳 ›</span></div><div class="ctl rv" data-d="900"><div class="seg" id="m6"></div></div><svg id="g6" width="1090" height="662" viewBox="0 0 1090 662"></svg></div><div class="rc box rv" data-d="2600" style="width:610px"><div class="bt">根拠</div><div class="bs" id="say6"></div><table class="tb roomy" id="t6"></table><div class="chk" id="c6"></div></div>`;
 seg("#m6",[[1,esc(PD[1])],[2,esc(PD[2])]],2,v=>{this.pi=+v;this.set("morph")});
 const R=runRange([CFS[1],CFS[2]]);
 this.W=WF($("#g6"),{W:1090,H:662,n:Math.max(CFS[1].st.length,CFS[2].st.length)+2,max:R.max,min:R.min});const g=this.W.g,s=this.W.slot;
 E("path",{d:`M${s+8},612 V620 H${7*s-8} V612`,fill:"none",stroke:"#66737F","stroke-width":1.5},g);this.br=E("text",{x:4*s,y:648,class:"nm","text-anchor":"middle",style:"font-weight:700"},g)},
 set(mode){const d=CFS[this.pi],i=this.pi;
  wfSet(this.W,d,mode,k=>"cf-"+k,x=>{const l=x.l.replace("\n","");return x.t==="d"?`${l}：${fs(x.v)}百万円（現預金への影響）`:`${l}：${fm(x.v)}百万円`});
  loop(mode==="morph"?800:mode==="build"?600:0,mode==="build"?2200:0,EO,p=>{this.br.textContent=`営業CF ${fs(d.ocf)}`});
  const ai=-(d.st[2].v+d.st[3].v);
  $("#say6").textContent=`営業CFは${fs(d.ocf)}百万円でした。売掛金と在庫で${fm(Math.abs(ai))}百万円${ai>=0?"のお金が使われ":"のお金が戻り"}、現預金は${fs(dl(bs.cash,i))}百万円となりました。${capex(i).est?"設備投資額は推計です。":""}`;
  const R=[["cf-ocf","営業CF",j=>CFS[j].ocf],["cf-arinv","うち売掛金・在庫の影響",j=>CFS[j].st[2].v+CFS[j].st[3].v],["cf-icf","投資CF"+(capex(1).est||capex(2).est?"（推計を含む）":""),j=>CFS[j].icf],["cf-fcf","財務CF",j=>CFS[j].fcf],...(CFS[1].gap||CFS[2].gap?[["cf-gap","その他",j=>CFS[j].gap]]:[]),["cf-end","現預金の増減",j=>dl(bs.cash,j)]];
  $("#t6").innerHTML=`<tr><th>区分（百万円）</th><th>${esc(PD[1])}</th><th>${esc(PD[2])}</th></tr>`+R.map((r,j)=>`<tr class="ck${j===R.length-1?" hl":""}" data-pk="${r[0]}"><td>${r[1]}</td>${[1,2].map(q=>`<td class="${q===i?"c":""} ${r[2](q)<0?"neg":""}">${fs(r[2](q))}</td>`).join("")}</tr>`).join("");
  const s3=d.ocf+d.icf+d.fcf+d.gap;$("#c6").textContent=`営業CF＋投資CF＋財務CF${d.gap?"＋その他":""}＝${fy(s3)}円、現預金の増減＝${fy(dl(bs.cash,i))}円（${s3===dl(bs.cash,i)?"円単位で一致":"不一致"}）`},
 enter(){head(6);this.set("build");T(3000,()=>ping($("#m6")))}};
/* ---------- 7 来期への論点 ---------- */
const costL=MC?"材料費率":"売上原価率",costA=MC?"材料費":"売上原価";
function issueQ(ty){const c=CFS[2];
 if(ty==="cost_rate")return[`${costL}（${costA}÷売上高）　<b>${trR(cr)}</b>`,`${costL}が1ポイント下がると、営業利益は<b>${fs(S[2]*.01)}百万円</b>（試算）`];
 if(ty==="gp_rate")return[`売上総利益率　<b>${trR(gr)}</b>`,`売上総利益率が1ポイント上がると、営業利益は<b>${fs(S[2]*.01)}百万円</b>（試算）`];
 if(ty==="sga_rate")return[`販管費率（販管費÷売上高）　<b>${trR(sgr)}</b>`,`販管費を1%減らすと、営業利益は<b>${fs(pl.sga[2]*.01)}百万円</b>（試算）`];
 if(ty==="ar_turn"){const g_=(arM(2)-arM(1))*S[2]/12;return[`売掛金回転（売掛金÷月商）　<b>${trT(at)}</b>`,`回転が${esc(PD[1])}並みなら、売掛金は<b>${fm(Math.abs(g_))}百万円</b>${g_>=0?"少ない":"多い"}計算です`]}
 if(ty==="inv_turn"){const g_=(invM(2)-invM(1))*S[2]/12;return[`棚卸資産回転（棚卸資産÷月商）　<b>${trT(it)}</b>`,`回転が${esc(PD[1])}並みなら、在庫は<b>${fm(Math.abs(g_))}百万円</b>${g_>=0?"少ない":"多い"}計算です`]}
 return[`営業CF <b>${fs(c.ocf)}</b>、借入金 <b>${fm(debt[1])}→${fm(debt[2])}（${fs(dl(debt,2))}）</b>`,dl(bs.ltl,2)<0&&c.ocf>0?`営業CFの<b>${Math.round(-dl(bs.ltl,2)/c.ocf*100)}%</b>が長期借入金の減少分にあたります`:`長期借入金 ${fm(bs.ltl[1])}→${fm(bs.ltl[2])}、短期借入金 ${fm(bs.stl[1])}→${fm(bs.stl[2])}`]}
PG[7]={build(){const b=frame(7);
 const mn=M0-5,FS=F0/100;
 b.innerHTML=`<div class="lc" style="width:860px"><div class="tr rv" data-d="900"><span class="ttl">来期に決めていただきたいこと（百万円）</span><span class="hint">押すと内訳 ›</span></div><div style="margin-top:18px">${ISS.map((t,i)=>{const q=issueQ(t.type);return`<div class="iq rv ck" data-d="${1100+i*250}" data-pk="q${i+1}" tabindex="0"><div class="iqh"><b class="ib">${NUM[i]}</b>${esc(t.t)}</div><div class="iqd">${q[0]}<br>${q[1]}</div><div class="iqf">社長に伺いたいこと：${esc(askOf(ISSUE_TYPES[t.type].ask)[0])}</div></div>`}).join("")}</div></div>
 <div class="rc sim rv" data-d="1900" style="width:850px"><div class="ttl">来期の試算（単位：百万円）</div>
 <div class="sl"><label for="sg">売上の増減率</label><input id="sg" type="range" min="-10" max="20" step="1" value="0"><output id="og"></output></div>
 <div class="sl"><label for="sm">${costL}</label><input id="sm" type="range" min="${Math.max(0,mn)}" max="${M0+5}" step="0.5" value="${M0}"><output id="om"></output></div>
 <div class="sl"><label for="sf">固定費の増減</label><input id="sf" type="range" min="-10" max="10" step="1" value="0"><output id="of"></output></div>
 <div class="res"><span class="rl">来期の営業利益（試算）</span><span class="rb" id="rb">0.0</span><span class="rd" id="rd"></span></div>
 <svg id="g7" width="790" height="236" viewBox="0 0 790 236"></svg>
 <div class="fxs" id="fx7"></div></div>`;
 /* 目盛りはスライダーの端の値から決める（どの規模の会社でも枠に収まる） */
 const opAt=(gg,m,f)=>S[2]*(1+gg/100)*(1-(m+O0)/100)-F0*(1+f/100);
 const ex=[opAt(-10,M0+5,10),opAt(20,Math.max(0,mn),-10),pl.op[2],0],lo=Math.min(...ex),hi=Math.max(...ex),sp=(hi-lo)||1;
 const ox=v=>140+(v-lo)/sp*480,smax=S[2]*1.25,sx=v=>140+Math.min(Math.max(v,0),smax)/smax*480;this.ox=ox;this.sx=sx;
 const g=$("#g7");E("text",{x:0,y:54,class:"nm",style:"font-weight:700"},g,"営業利益");E("text",{x:0,y:182,class:"nm",style:"font-weight:700"},g,"売上高");
 E("line",{x1:ox(0),x2:ox(0),y1:6,y2:100,class:"ax"},g);E("line",{x1:sx(0),x2:sx(0),y1:136,y2:230,class:"ax"},g);
 const a0=Math.min(ox(0),ox(pl.op[2]));this.o0=st(E("rect",{fill:"#1F5FA8"},g),{x:a0,y:12,width:Math.abs(ox(pl.op[2])-ox(0)),height:34});E("text",{x:Math.max(ox(0),ox(pl.op[2]))+8,y:36,class:"nm"},g,`${PD[2]}実績 ${fm(pl.op[2])}`);
 this.o1=st(E("rect",{fill:"none",stroke:"#1F5FA8","stroke-width":2,"stroke-dasharray":"7 5"},g),{x:ox(0),y:58,width:0,height:34});this.o1t=st(E("text",{class:"nm"},g),{x:ox(0),y:82});
 this.s0=st(E("rect",{fill:"#A9C6E8"},g),{x:sx(0),y:142,width:sx(S[2])-sx(0),height:34});E("text",{x:sx(0)+12,y:166,class:"nm"},g,`${PD[2]}実績 ${fm(S[2])}`);
 this.s1=st(E("rect",{fill:"none",stroke:"#1F5FA8","stroke-width":2,"stroke-dasharray":"7 5"},g),{x:sx(0),y:188,width:0,height:34});this.s1t=st(E("text",{class:"nm"},g),{x:sx(0)+12,y:212});
 this.be=st(E("line",{stroke:"#0E2A47","stroke-width":2.5,"stroke-dasharray":"6 5"},g),{x1:sx(0),x2:sx(0),y1:130,y2:232});this.bet=st(E("text",{class:"nm","text-anchor":"middle",style:"font-weight:700"},g),{x:sx(0),y:124});
 ["sg","sm","sf"].forEach(id=>$("#"+id).addEventListener("input",()=>this.upd(250)))},
 calc(){const gg=+$("#sg").value,m=+$("#sm").value,f=+$("#sf").value,S1=S[2]*(1+gg/100),v=(m+O0)/100,F1=F0*(1+f/100),OP=S1*(1-v)-F1;return{gg,m,f,S1,v,F1,OP,BEP:v<1?F1/(1-v):NaN}},
 upd(dur,delay=0){const r=this.calc(),ox=this.ox,sx=this.sx;
  $("#og").textContent=`${r.gg>0?"+":r.gg<0?"▲":""}${Math.abs(r.gg)}%`;$("#om").textContent=`${f1(r.m)}%（当期 ${f1(M0)}%）`;$("#of").textContent=`${fs(F0*r.f/100)}（${r.f>0?"+":r.f<0?"▲":""}${Math.abs(r.f)}%）`;
  const a=Math.min(ox(0),ox(r.OP)),w=Math.abs(ox(r.OP)-ox(0));mv(this.o1,{x:a,width:w},dur,delay);mv(this.o1t,{x:(r.OP>=0?ox(r.OP):ox(0))+8},dur,delay);this.o1t.textContent=`来期試算 ${fm(r.OP)}`;
  mv(this.s1,{width:sx(r.S1)-sx(0)},dur,delay);this.s1t.textContent=`来期試算 ${fm(r.S1)}`;
  const bx=sx(nul(r.BEP)?0:r.BEP);mv(this.be,{x1:bx,x2:bx},dur,delay);mv(this.bet,{x:bx},dur,delay);this.bet.textContent=`損益分岐点 ${fm(r.BEP)}${r.BEP>S[2]*1.25?"（枠外）":""}`;
  const rb=$("#rb");rb.classList.toggle("neg",r.OP<0);cnt(rb,r.OP,fm,dur?Math.max(dur,300):0,delay);const dd=r.OP-pl.op[2];const rd=$("#rd");rd.textContent=`当期比 ${fs(dd)}`;rd.classList.toggle("neg",Math.round(dd/1e5)<0);
  $("#fx7").innerHTML=`来期営業利益＝来期売上×（1−変動費率）−固定費＝${fm(r.S1)}×（1−${pc(r.v*100)}）−${fm(r.F1)}＝${fm(r.OP)}<br>損益分岐点売上＝固定費÷（1−変動費率）＝${fm(r.F1)}÷${(1-r.v).toFixed(3)}＝${fm(r.BEP)}<br><span class="nt2">分け方：${MC?`変動費＝材料費＋外注加工費（外注加工費率は当期の${pc(O0)}のまま）、固定費＝それ以外の売上原価＋販管費`:"変動費＝売上原価、固定費＝販管費"}（当期 ${fm(F0)}）<br>試算（前提：当期の費用構造が続く。在庫の増減・特別な費用は含まない）</span>`},
 enter(){head(7);$("#rb")._n=0;this.upd(1200,2000);T(3000,()=>ping($("#sg").parentElement))}};
/* ---------- 根拠パネル ---------- */
const ASK0={
 sales:["売上が動いた主な理由は、社長の実感と合っていますか","来期の受注は、今期と比べてどう見ていらっしゃいますか"],
 cost:["仕入価格の動きで、来期に見込んでいることはありますか","価格の見直しを相談できそうな取引先はありますか"],
 out:["外注に出している仕事のうち、社内でできるものはありますか","来期の外注は今期と同じくらいの見込みでしょうか"],
 labor:["来期の採用や人員の予定はありますか","人の配置や残業の状況に変化はありましたか"],
 sga:["増えた経費のうち、来期も続くものはどれでしょうか","来期も同じくらいの販管費を見込んでいらっしゃいますか"],
 ar:["入金が予定より遅れている取引先はありますか","支払条件の長い取引先は増えていますか"],
 inv:["期末に在庫が増えた理由に心当たりはありますか","すぐには出荷できない在庫はありますか"],
 debt:["来期の借入金の返済額は、今期と同じくらいの見込みでしょうか","新たな借入や借り換えのご予定はありますか"],
 ppe:["来期に予定している設備投資はありますか","今の設備の稼働状況はいかがでしょうか"],
 cash:["手元資金として、最低これだけは置いておきたいという額はありますか","入金と支払の時期がずれて、資金が苦しくなる月はありますか"],
 op:["利益が動いた理由について、社長の実感と合っていますか","来期の営業利益の目標はどのくらいをお考えですか"]};
const TA=TX.ask||{};
const ASK={};Object.keys(ASK0).forEach(k=>{const a=Array.isArray(TA[k])?TA[k].filter(Boolean).slice(0,3).map((x,j)=>fill(x,`社長に聞きたいこと（${k}）`,70,1)):[];ASK[k]=a.length?a:ASK0[k]});
function askOf(k){return ASK[k]||ASK0.op}
const TS=TX.say||{};
const sayOf=(key,def)=>TS[key]?fill(TS[key],`パネルの一言（${key}）`,80):def;
const H3=["科目",...PD],rw=(l,a,f=fk)=>[l,...a.map(f)];
function PS(key){const r=PS0(key);if(r)r.s=sayOf(key,r.s);return r}
function PS0(key){const sec=HEAD[cur]?HEAD[cur].s:"",pr=PWS[PG[3].pi],c=CFS[PG[6].pi];
 const plr=[rw("売上高",S),rw("売上原価",pl.cogs),rw("売上総利益",pl.gp),rw("販管費",pl.sga),rw("営業利益",pl.op)];
 const plf=[`売上総利益率＝売上総利益÷売上高（${PD[2]}：${fy(pl.gp[2])}÷${fy(S[2])}＝${pc(gpR(2))}）`,`営業利益率＝営業利益÷売上高（${PD[2]}：${fy(pl.op[2])}÷${fy(S[2])}＝${pc(opR(2))}）`,`売上高の前期比＝${fy(S[2])}÷${fy(S[1])}−1＝${f1s(g2)}%`];
 if(key==="pl-sales"||key==="k-sales")return{c:`${sec} › 売上高`,s:`売上高は${PD[0]}から2期で${fs(S[2]-S[0])}百万円（${f1s((S[2]/S[0]-1)*100)}%）${dirW(S[2]-S[0])}ました。`,h:H3,r:plr,f:plf,a:askOf("sales"),src:`${PD[0]}〜${PD[2]} 損益計算書`};
 if(key==="pl-gp"||key==="rt-gp")return{c:`${sec} › 売上総利益`,s:`売上総利益率は${trR(gr)}と${rateW(gr)}ました。`,h:H3,r:plr,f:plf,a:askOf("cost"),src:`${PD[0]}〜${PD[2]} 損益計算書`};
 if(key==="pl-op"||key==="rt-op"||key==="k-op")return{c:`${sec} › 営業利益`,s:`営業利益は${PD[1]}の${fm(pl.op[1])}百万円から、${PD[2]}は${fm(pl.op[2])}百万円になりました。`,h:H3,r:plr,f:plf,a:askOf("op"),src:`${PD[0]}〜${PD[2]} 損益計算書`};
 if(key==="k-cash"||key==="cf-start"||key==="cf-end"){const i=PG[6].pi;return{c:`${sec} › 現預金`,s:`現預金は${I3.map(i=>fm(bs.cash[i])).join("→")}百万円と推移しました。`,h:["区分",PD[1],PD[2]],
  r:[["期首の現預金",fk(bs.cash[0]),fk(bs.cash[1])],["営業CF",fk(CFS[1].ocf),fk(CFS[2].ocf)],["投資CF",fk(CFS[1].icf),fk(CFS[2].icf)],["財務CF",fk(CFS[1].fcf),fk(CFS[2].fcf)],...(CFS[1].gap||CFS[2].gap?[["その他",fk(CFS[1].gap),fk(CFS[2].gap)]]:[]),["期末の現預金",fk(bs.cash[1]),fk(bs.cash[2])]],
  f:[`期首＋営業CF＋投資CF＋財務CF${CFS[i].gap?"＋その他":""}＝期末（${PD[i]}：${fy(bs.cash[i-1])}＋${fy(CFS[i].ocf)}＋${fy(CFS[i].icf)}＋${fy(CFS[i].fcf)}${CFS[i].gap?"＋"+fy(CFS[i].gap):""}＝${fy(bs.cash[i])}円）`],a:askOf("cash"),src:`${PD[0]}〜${PD[2]} 貸借対照表・損益計算書`}}
 if(key.startsWith("pw-")){const k=key.slice(3),a=pr.a,b=pr.b,hh=["科目",PD[a],PD[b],"差"],r2=(l,x)=>[l,fk(x[a]),fk(x[b]),fks(x[b]-x[a])],src=`${PD[a]}・${PD[b]} 損益計算書${MC?"・製造原価報告書":""}`,s=pr.st.find(x=>x.k===k);
  if(k==="start"||k==="end"){const i=k==="start"?a:b;return{c:`${sec} › ${PD[i]}の営業利益`,s:`営業利益＝売上総利益−販管費で、${PD[i]}は${fm(pl.op[i])}百万円です。`,h:hh,r:[r2("売上高",S),r2("売上原価",pl.cogs),r2("売上総利益",pl.gp),r2("販管費",pl.sga),r2("営業利益",pl.op)],f:[`${PD[i]}：${fy(pl.gp[i])}−${fy(pl.sga[i])}＝${fy(pl.op[i])}円`],a:askOf("op"),src}}
  if(k==="sales")return{c:`${sec} › 売上高`,s:`売上高が${fs(s.v)}百万円動き、営業利益を同じ額だけ動かす段です。`,h:hh,r:[r2("売上高",S)],f:[`段＝${PD[b]}売上高−${PD[a]}売上高＝${fy(S[b])}−${fy(S[a])}＝${fy(s.v)}円`],a:askOf("sales"),src};
  if(k==="cogs"){const rows=MC?[r2("材料費",mc.mat),r2("外注加工費",mc.out),r2("製造労務費",mc.labor),r2("製造原価の減価償却費",mc.mdep),r2("製造経費（その他）",mc.mexp),r2("在庫の増減ほか",mc.adj),r2("売上原価",pl.cogs)]:[r2("売上原価",pl.cogs)];
   return{c:`${sec} › 売上原価`,s:`売上原価は${fm(Math.abs(s.v))}百万円${s.v<=0?"増えました":"減りました"}${MC?`。うち材料費は${fs(mc.mat[b]-mc.mat[a])}百万円です`:""}。`,h:hh,r:rows,f:[...(MC?["売上原価＝当期総製造費用＋期首棚卸高−期末棚卸高"]:[]),`段＝−（${fy(pl.cogs[b])}−${fy(pl.cogs[a])}）＝${fy(s.v)}円`],a:[askOf("cost")[0],...(MC?[askOf("out")[0]]:[])],src}}
  if(k==="rest")return{c:`${sec} › ${s.l}`,s:`影響の小さい${s.items.length}科目をまとめた段で、合計${fs(s.v)}百万円です。`,h:hh,r:s.items.map(x=>r2(LB[x.k],pl[x.k])),f:[`段＝−（各科目の増減の合計）＝${fy(s.v)}円`],a:askOf("sga"),src};
  if(k==="gap")return{c:`${sec} › 端数・その他`,s:"内訳の合計と営業利益の差額です。",h:hh,r:[["差額","","",fk(s.v)]],f:["営業利益の増減−（各段の合計）"],a:askOf("op"),src};
  if(s){const kd=(SGI.find(x=>x.k===k)||{}).kind;return{c:`${sec} › ${s.l}`,s:`${s.l}は${fm(Math.abs(s.v))}百万円${s.v<=0?"増え、営業利益をその分押し下げました":"減り、営業利益をその分押し上げました"}。`,h:hh,r:[r2(s.l,pl[k]),r2("販管費の合計",pl.sga)],f:[`段＝−（${fy(pl[k][b])}−${fy(pl[k][a])}）＝${fy(s.v)}円`],a:kd==="pers"?askOf("labor"):askOf("sga"),src}}}
 if(key.startsWith("c-")){const k=key.slice(2),src=`${PD[0]}〜${PD[2]} 損益計算書${MC?"・製造原価報告書":""}`,p=I3.map(per),pr100=a=>["売上100円あたり（円）",...a.map(f1)];
  if(k==="pers"){const a=I3.map(pers),rows=[...SGI.filter(x=>x.kind==="pers").map(x=>rw(x.l,x.v)),...(MC&&mc.labor.some(v=>v)?[rw("製造労務費",mc.labor)]:[]),rw("人件費の合計",a),pr100(I3.map(i=>a[i]/S[i]*100))];
   return{c:`${sec} › 人件費`,s:`人件費は売上100円あたり${I3.map(i=>f1(a[i]/S[i]*100)).join("→")}円です。`,h:H3,r:rows,f:[`人件費＝販管費の人件費${MC&&mc.labor.some(v=>v)?"＋製造労務費":""}（${PD[2]}：${fy(a[2])}円）`,`売上100円あたり＝人件費÷売上高×100`],a:askOf("labor"),src}}
  const Mm={mat:[[LB.mat,mc.mat]],out:[["外注加工費",mc.out]],labor:[["製造労務費",mc.labor]],exp:[["製造原価の減価償却費",mc.mdep],["製造経費（その他）",mc.mexp],["在庫の増減ほか",mc.adj]],sga:[["販管費の合計",pl.sga]],op:[["営業利益",pl.op]]}[k];
  if(!Mm)return null;
  const sg_=SEG.find(x=>x[0]===k),nm=sg_?sg_[1]:k,v2=k==="exp"?mc.mdep[2]+mc.mexp[2]+mc.adj[2]:Mm[0][1][2];
  const tr=p.map(x=>f1(x[k])).join("→");
  const say={mat:`${LB.mat}は売上100円あたり${tr}円です。`,out:`外注加工費は売上100円あたり${tr}円です。`,labor:`製造労務費は売上100円あたり${tr}円です。`,exp:`経費・在庫は売上100円あたり${tr}円です。期末の在庫が増えた分だけ小さくなります。`,sga:`販管費は売上100円あたり${tr}円です。`,op:`売上100円あたりの営業利益は${tr}円です。`}[k];
  return{c:`${sec} › ${nm}`,s:say,h:H3,r:[...Mm.map(([l,a])=>rw(l,a)),pr100(p.map(x=>x[k]))],f:[`売上100円あたり＝${nm}÷売上高×100（${PD[2]}：${fy(v2)}÷${fy(S[2])}×100＝${f1(p[2][k])}円）`],a:{mat:askOf("cost"),out:askOf("out"),labor:askOf("labor"),exp:askOf("inv"),sga:askOf("sga"),op:askOf("op")}[k],src}}
 if(key.startsWith("b-")||key.startsWith("r-")){const src=`${PD[0]}〜${PD[2]} 貸借対照表・損益計算書`,k=key.slice(2),mv_=(a,nm)=>`${nm}は${trM(a)}と${amtW(a)}ました。`;
  const Bb={cash:[[["現金及び預金",bs.cash]],mv_(bs.cash,"現預金"),askOf("cash")],ar:[[["売掛金",bs.ar]],mv_(bs.ar,"売掛金"),askOf("ar")],
   inv:[[["棚卸資産",bs.inv]],mv_(bs.inv,"棚卸資産"),askOf("inv")],ppe:[[["有形固定資産",bs.ppe]],mv_(bs.ppe,"有形固定資産"),askOf("ppe")],
   oth:[[["その他流動資産",bs.oca],["投資その他の資産など",I3.map(i=>bs.ioa[i]+bs.ra[i])]],"金額の小さい資産をまとめた面です。",askOf("cash")],ap:[[["買掛金",bs.ap]],mv_(bs.ap,"買掛金"),askOf("cost")],
   accr:[[["未払金・未払費用",bs.accr],["未払法人税等",bs.taxp],["その他の負債",bs.ol]],"未払いの費用・税金とその他の負債をまとめた面です。",askOf("cash")],stl:[[["短期借入金",bs.stl]],mv_(bs.stl,"短期借入金"),askOf("debt")],
   ltl:[[["長期借入金（1年内返済分を含む）",bs.ltl]],mv_(bs.ltl,"長期借入金"),askOf("debt")],na:[[...(bs.cap.some(v=>v)?[["資本金",bs.cap]]:[]),...(bs.re.some(v=>v)?[["繰越利益剰余金",bs.re]]:[]),["純資産合計",bs.na]],mv_(bs.na,"純資産"),askOf("op")]};
  if(Bb[k])return{c:`${sec} › ${Bb[k][0].slice(-1)[0][0]}`,s:Bb[k][1],h:H3,r:[...Bb[k][0].map(([l,a])=>rw(l,a)),rw("資産合計",bs.ta)],f:[`面の高さは金額に比例（3期とも同じ縮尺）`,`構成比＝${Bb[k][0].slice(-1)[0][0]}÷資産合計（${PD[2]}：${pc(Bb[k][0].slice(-1)[0][1][2]/bs.ta[2]*100)}）`],a:Bb[k][2],src};
  const Rr={eq:["自己資本比率",[rw("純資産合計",bs.na),rw("資産合計",bs.ta),["自己資本比率",...I3.map(i=>pc(eqR(i)))]],`自己資本比率＝純資産÷資産合計（${PD[2]}：${fy(bs.na[2])}÷${fy(bs.ta[2])}＝${pc(eqR(2))}）`,`自己資本比率は${trR(er)}と${rateW(er)}ました。`,askOf("debt")],
   cur:["流動比率",[rw("流動資産",I3.map(CA)),rw("流動負債（長期借入金を含まない）",I3.map(CL)),["流動比率",...I3.map(i=>pc(curR(i)))]],`流動比率＝流動資産÷流動負債（${PD[2]}：${fy(CA(2))}÷${fy(CL(2))}＝${pc(curR(2))}）。1年内返済の長期借入金は含めていません`,`流動比率は${trR(I3.map(curR))}です。`,askOf("debt")],
   ar:["売掛金回転",[rw("売掛金",bs.ar),rw("月商（売上高÷12）",I3.map(i=>S[i]/12)),["売掛金回転（か月）",...I3.map(i=>f1(arM(i)))]],`売掛金回転＝売掛金÷（売上高÷12）（${PD[2]}：${fy(bs.ar[2])}÷${fy(S[2]/12)}＝${f1(arM(2))}か月）`,`売上の約${f1(arM(2))}か月分が未回収で残っている計算です。`,askOf("ar")],
   debt:["借入金",[rw("短期借入金",bs.stl),rw("長期借入金（1年内返済分を含む）",bs.ltl),rw("借入金の合計",debt),rw("現金及び預金",bs.cash)],`借入金の合計＝短期借入金＋長期借入金（${PD[2]}：${fy(bs.stl[2])}＋${fy(bs.ltl[2])}＝${fy(debt[2])}円）`,`借入金の合計は${trM(debt)}です。`,askOf("debt")],
   inv:["棚卸資産回転",[rw("棚卸資産",bs.inv),rw("月商（売上高÷12）",I3.map(i=>S[i]/12)),["棚卸資産回転（か月）",...I3.map(i=>f1(invM(i)))]],`棚卸資産回転＝棚卸資産÷（売上高÷12）（${PD[2]}：${fy(bs.inv[2])}÷${fy(S[2]/12)}＝${f1(invM(2))}か月）`,`在庫は月商の${trT(it)}分です。`,askOf("inv")]}[k];
  if(Rr)return{c:`${sec} › ${Rr[0]}`,s:Rr[3],h:H3,r:Rr[1],f:[Rr[2]],a:Rr[4],src}}
 if(key.startsWith("cf-")){const k=key.slice(3),i=c.i,hh=["科目",`${PD[i-1]}末`,`${PD[i]}末`,"増減"],b3=(l,a)=>[l,fk(a[i-1]),fk(a[i]),fks(a[i]-a[i-1])],src=`${PD[i-1]}・${PD[i]} 貸借対照表、${PD[i]} 損益計算書`,s=c.st.find(x=>x.k===k),cx=capex(i);
  const X={ni:[`当期純利益${fm(pl.ni[i])}百万円が出発点です。`,[["当期純利益","","",fk(pl.ni[i])]],[`当期純利益＝${fy(pl.ni[i])}円（損益計算書）`],askOf("op")],
   dep:["減価償却費は費用ですが、お金は出ていかないため足し戻します。",[["減価償却費（販管費）","","",fk(DEPS[i])],...(MC?[["減価償却費（製造原価）","","",fk(mc.mdep[i])]]:[])],[`減価償却費＝${fy(DEPS[i])}${MC?"＋"+fy(mc.mdep[i]):""}＝${fy(depT(i))}円`],askOf("ppe")],
   ar:[`売掛金が${fs(dl(bs.ar,i))}百万円動きました。増えた分は入金がまだのため、お金が減ったのと同じになります。`,[b3("売掛金",bs.ar)],[`段＝−（${fy(bs.ar[i])}−${fy(bs.ar[i-1])}）＝${fy(-dl(bs.ar,i))}円`],askOf("ar")],
   inv:[`棚卸資産が${fs(dl(bs.inv,i))}百万円動きました。増えた分のお金が在庫として残っています。`,[b3("棚卸資産",bs.inv)],[`段＝−（${fy(bs.inv[i])}−${fy(bs.inv[i-1])}）＝${fy(-dl(bs.inv,i))}円`],askOf("inv")],
   ap:[`買掛金が${fs(dl(bs.ap,i))}百万円動きました。増えた分は支払を待ってもらっている分だけお金が残ります。`,[b3("買掛金",bs.ap)],[`段＝${fy(bs.ap[i])}−${fy(bs.ap[i-1])}＝${fy(dl(bs.ap,i))}円`],askOf("cost")],
   oth:["その他流動資産・未払金等・未払法人税等・その他の負債の増減の合計です。",[b3("その他流動資産（増加はマイナス）",bs.oca),b3("未払金・未払費用",bs.accr),b3("未払法人税等",bs.taxp),b3("その他の負債",bs.ol)],[`段＝−${fy(dl(bs.oca,i))}＋${fy(dl(bs.accr,i))}＋${fy(dl(bs.taxp,i))}＋${fy(dl(bs.ol,i))}＝${fy(s?s.v:0)}円`],askOf("cash")],
   icf:[`設備投資${fm(cx.v)}百万円${cx.est?"（推計）":"（状況メモ）"}などで、お金が動きました。`,[["設備投資額"+(cx.est?"（推計）":""),"","",fk(-cx.v)],b3("投資その他の資産など（増加はマイナス）",I3.map(j=>bs.ioa[j]+bs.ra[j]))],[`投資CF＝−設備投資額−投資その他の資産などの増加＝${fy(c.icf)}円`,...(cx.est?["設備投資額の推計＝有形固定資産の増加＋減価償却費"]:[])],askOf("ppe")],
   fcf:[`短期借入金が${fs(dl(bs.stl,i))}、長期借入金が${fs(dl(bs.ltl,i))}百万円動きました。`,[b3("短期借入金",bs.stl),b3("長期借入金",bs.ltl)],[`財務CF＝借入金の増減＝${fy(dl(bs.stl,i))}＋${fy(dl(bs.ltl,i))}＝${fy(c.fcf)}円（配当・増資は「その他」に入ります）`],askOf("debt")],
   arinv:[`売掛金と棚卸資産の動きで、現預金が${fs(-(dl(bs.ar,i)+dl(bs.inv,i)))}百万円動きました。`,[b3("売掛金",bs.ar),b3("棚卸資産",bs.inv)],[`売掛金の増加＋棚卸資産の増加＝${fy(dl(bs.ar,i))}＋${fy(dl(bs.inv,i))}＝${fy(dl(bs.ar,i)+dl(bs.inv,i))}円`],askOf("ar")],
   ocf:[`営業CFは${fs(c.ocf)}百万円です。`,c.st.slice(0,6).map(x=>[x.l.replace("\n",""),"","",fks(x.v)]),["営業CF＝当期純利益＋減価償却費−売掛金の増加−棚卸資産の増加＋買掛金の増加＋その他（営業）",`＝${fy(c.ocf)}円`],askOf("ar")]};
  if(k==="gap")return{c:`${sec} › その他`,s:"配当・増資や、決算書から分けられない動きの合計です。",h:hh,r:[["差額","","",fk(c.gap)]],f:["現預金の増減−（営業CF＋投資CF＋財務CF）"],a:askOf("cash"),src};
  const x=X[k];if(x)return{c:`${sec} › ${{ni:"当期純利益",dep:"減価償却費",ar:"売掛金",inv:"棚卸資産",ap:"買掛金",oth:"その他（営業）",icf:"投資CF",fcf:"財務CF",ocf:"営業CF",arinv:"売掛金と在庫"}[k]}`,s:x[0],h:hh,r:x[1],f:x[2],a:x[3],src}}
 if(key[0]==="q"){const n=+key[1]-1,t=ISS[n];if(!t)return null;const c2=CFS[2];
  const QQ={cost_rate:[[rw("売上高",S),rw(costA,mc.mat),[costL,...I3.map(i=>pc(cr[i]))]],[`${costL}＝${costA}÷売上高（${PD[2]}：${fy(mc.mat[2])}÷${fy(S[2])}＝${pc(M0)}）`,`1ポイントの影響＝売上高×1%＝${fy(S[2]*.01)}円（試算）`],"損益計算書"],
   gp_rate:[[rw("売上高",S),rw("売上総利益",pl.gp),["売上総利益率",...I3.map(i=>pc(gr[i]))]],[`売上総利益率＝売上総利益÷売上高（${PD[2]}：${pc(gr[2])}）`,`1ポイントの影響＝売上高×1%＝${fy(S[2]*.01)}円（試算）`],"損益計算書"],
   sga_rate:[[rw("売上高",S),rw("販管費",pl.sga),["販管費率",...I3.map(i=>pc(sgr[i]))]],[`販管費率＝販管費÷売上高（${PD[2]}：${pc(sgr[2])}）`,`販管費1%の影響＝${fy(pl.sga[2]*.01)}円（試算）`],"損益計算書"],
   ar_turn:[[rw("売上高",S),rw("売掛金",bs.ar),["売掛金回転（か月）",...I3.map(i=>f1(at[i]))]],[`売掛金回転＝売掛金÷（売上高÷12）`,`${PD[1]}並みとの差＝（${f1(at[2])}−${f1(at[1])}）×${fy(S[2]/12)}＝${fy((at[2]-at[1])*S[2]/12)}円`],"損益計算書・貸借対照表"],
   inv_turn:[[rw("売上高",S),rw("棚卸資産",bs.inv),["棚卸資産回転（か月）",...I3.map(i=>f1(it[i]))]],[`棚卸資産回転＝棚卸資産÷（売上高÷12）`,`${PD[1]}並みとの差＝（${f1(it[2])}−${f1(it[1])}）×${fy(S[2]/12)}＝${fy((it[2]-it[1])*S[2]/12)}円`],"損益計算書・貸借対照表"],
   debt:[[rw("短期借入金",bs.stl),rw("長期借入金",bs.ltl),["営業CF","",fk(CFS[1].ocf),fk(c2.ocf)]],[`借入金の合計＝${trM(debt)}`,...(dl(bs.ltl,2)<0&&c2.ocf>0?[`長期借入金の減少÷営業CF＝${fy(-dl(bs.ltl,2))}÷${fy(c2.ocf)}＝${pc(-dl(bs.ltl,2)/c2.ocf*100)}`]:[])],"貸借対照表・損益計算書"]}[t.type];
  return{c:`${sec} › 論点${NUM[n]} ${t.t}`,s:t.why||issueQ(t.type)[0].replace(/<[^>]+>/g,""),h:H3,r:QQ[0],f:QQ[1],a:askOf(ISSUE_TYPES[t.type].ask),src:`${PD[0]}〜${PD[2]} ${QQ[2]}`}}
 return null}
function openPanel(key,src){const p=PS(key);if(!p)return;$("#pc").textContent=p.c;$("#ps").textContent=p.s;
 $("#pt0").innerHTML=`<div class="pu">単位：千円</div><table class="pt"><tr>${p.h.map(x=>`<th>${esc(x)}</th>`).join("")}</tr>${p.r.map((r,i)=>`<tr class="prow" style="animation-delay:${180+i*40}ms">${r.map((x,j)=>`<td${j?"":` class="l"`}>${esc(x)}</td>`).join("")}</tr>`).join("")}</table><div class="fx">${p.f.map((x,i)=>`<div class="prow" style="animation-delay:${180+(p.r.length+i)*40}ms">${esc(x)}</div>`).join("")}</div>`;
 $("#pt1").innerHTML=`<ol class="ask">${p.a.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>`;$("#psrc").textContent="出所："+p.src;tab(0);
 if(SELd)SELd.classList.remove("sel");SELd=src&&src.tagName!=="TR"&&src.namespaceURI===NS?src:null;if(SELd)SELd.classList.add("sel");
 $("#panel").classList.add("on");$("#panel").setAttribute("aria-hidden","false");$("#dim").classList.add("on")}
function closePanel(){$("#panel").classList.remove("on");$("#panel").setAttribute("aria-hidden","true");$("#dim").classList.remove("on");if(SELd)SELd.classList.remove("sel");SELd=null}
function tab(n){$$(".tabs button").forEach(b=>b.classList.toggle("on",+b.dataset.t===n));$("#pt0").hidden=n!==0;$("#pt1").hidden=n!==1}
$$(".tabs button").forEach(b=>b.onclick=()=>tab(+b.dataset.t));
/* ---------- ページ送り ---------- */
const stage=$("#stage");let SC=1;
function fit(){const v=$("#vp"),w=v.clientWidth,h=v.clientHeight;SC=Math.min(w/1920,h/1080);stage.style.transform=`translate(${(w-1920*SC)/2}px,${(h-1080*SC)/2}px) scale(${SC})`}
function nav(){$("#pn").textContent=cur?`${cur} / ${NP-1}`:`表紙 / ${NP-1}`;stage.classList.toggle("oncover",cur===0)}
function go(n,dir){n=Math.max(0,Math.min(NP-1,n));$("#grid").classList.remove("on");if(n===cur)return;closePanel();RUN++;const a=secs[cur],b=secs[n];dir=dir||(n>cur?1:-1);
 a.classList.remove("on");if(!STATIC){a.style.transform=`translateX(${-dir*90}px)`;setTimeout(()=>{if(!a.classList.contains("on")){a.style.transition="none";a.style.transform="";void a.offsetWidth;a.style.transition=""}},650);
  b.style.transition="none";b.style.transform=`translateX(${dir*90}px)`;void b.offsetWidth;b.style.transition=""}
 b.style.transform="";b.classList.add("on");cur=n;nav();PG[n].enter()}
/* ---------- 一覧 ---------- */
$("#grid").innerHTML=secs.map((s,i)=>`<div class="tile" data-n="${i}"><div class="tn">${i?`${i}　${HEAD[i].s}`:"表紙"}</div><div class="th">${i?HEAD[i].h.replace(/\|/g,""):COVER}</div></div>`).join("");
$("#grid").addEventListener("click",e=>{const t=e.target.closest(".tile");e.stopPropagation();if(t){$("#grid").classList.remove("on");go(+t.dataset.n)}});
/* ---------- 吹き出し ---------- */
const TP=$("#tip");
stage.addEventListener("mousemove",e=>{const t=e.target.closest("[data-tip]");if(!t){TP.style.opacity=0;return}const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/SC,y=(e.clientY-r.top)/SC;
 TP.textContent=t.getAttribute("data-tip");TP.style.opacity=1;const w=TP.offsetWidth;TP.style.left=Math.min(1900-w,x+18)+"px";TP.style.top=(y-52)+"px"});
stage.addEventListener("mouseleave",()=>TP.style.opacity=0);
/* ---------- 担当者向けの確認表示（問題があるときだけ出る） ---------- */
const CHK=$("#chk"),CHA=$("#chkall");
function showChk(){if(!WARN.length){CHK.style.display="none";return}
 const nf=WARN.filter(w=>w.lv==="要修正").length;
 CHK.innerHTML=`<span class="cm"><b>担当者の方へ：確認が必要な点が${WARN.length}件あります${nf?`（うち要修正${nf}件）`:""}。社長にお見せする前に直してください。</b> ${esc(WARN[0].m)}</span><button id="chkv">全部見る（C）</button><button id="chkx" aria-label="閉じる">×</button>`;CHK.style.display="flex";stage.classList.add("haschk");
 $("#chkv").onclick=e=>{e.stopPropagation();toggleAll()};$("#chkx").onclick=e=>{e.stopPropagation();CHK.style.display="none";stage.classList.remove("haschk")}}
function toggleAll(){if(CHA.style.display==="block"){CHA.style.display="none";return}
 CHA.innerHTML=`<div class="bt">確認が必要な点（${WARN.length}件）</div><ol>${WARN.map(w=>`<li><b>[${w.lv}]</b> ${esc(w.m)}</li>`).join("")||"<li>ありません</li>"}</ol><div class="note">Cキーかクリックで閉じます。</div>`;CHA.style.display="block"}
CHA.addEventListener("click",e=>{e.stopPropagation();CHA.style.display="none"});
/* ---------- 操作 ---------- */
stage.addEventListener("click",e=>{if(e.isTrusted&&DEMO){stopDemo();return}
 if(e.target.closest("#chk,#chkall"))return;
 if($("#grid").classList.contains("on"))return;
 if(e.target.closest("#panel"))return;if(e.target.closest("#dim")){closePanel();return}
 const g=e.target.closest("[data-go]");if(g){go(+g.dataset.go);return}
 const p=e.target.closest("[data-pk]");if(p){openPanel(p.getAttribute("data-pk"),p);return}
 if(cur===0&&!e.target.closest("button"))go(1)});
$("#px").onclick=closePanel;$("#nb").onclick=e=>{e.stopPropagation();go(cur-1)};$("#nf").onclick=e=>{e.stopPropagation();go(cur+1)};
stage.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".ck,.card")){e.preventDefault();e.target.click()}});
document.addEventListener("keydown",e=>{const k=e.key,inp=e.target.tagName==="INPUT";
 if(DEMO){if(k!=="d"&&k!=="D"){stopDemo();return}}
 if(e.defaultPrevented)return;
 if(k==="Escape"){closePanel();$("#grid").classList.remove("on");CHA.style.display="none";return}
 if(inp&&(k==="ArrowLeft"||k==="ArrowRight"||k===" "))return;
 if(k===" "&&e.target.tagName==="BUTTON")return;
 if(k==="ArrowRight"||k===" "||k==="PageDown"){e.preventDefault();go(cur+1)}
 else if(k==="ArrowLeft"||k==="PageUp"){e.preventDefault();go(cur-1)}
 else if(/^[0-9]$/.test(k)&&+k<NP)go(+k);
 else if(k==="o"||k==="O")$("#grid").classList.toggle("on");
 else if(k==="c"||k==="C")toggleAll();
 else if(k==="d"||k==="D")DEMO?stopDemo():demo()});
/* ---------- 自動デモ ---------- */
function stopDemo(){DEMO=false;$("#dm").classList.remove("on")}
async function demo(){DEMO=true;$("#dm").classList.add("on");closePanel();$("#grid").classList.remove("on");
 const w=ms=>new Promise((ok,ng)=>setTimeout(()=>DEMO?ok():ng(),ms)),ck=el=>{if(typeof el==="string")el=$(el);if(el)el.dispatchEvent(new MouseEvent("click",{bubbles:true}))};
 const slide=async(id,to)=>{const s=$("#"+id),a=+s.value,st_=+s.step,n=Math.round(Math.abs(to-a)/st_);for(let j=1;j<=n;j++){s.value=a+Math.sign(to-a)*st_*j;s.dispatchEvent(new Event("input"));await w(110)}};
 try{go(0);await w(3800);go(1);await w(3800);ck($$("#s1 .card")[0]);await w(3600);
  ck('#m2 [data-v="gp"]');await w(1500);ck('#m2 [data-v="op"]');await w(1500);ck("#pl2");await w(3600);ck(PG[2].bars[2]);await w(2600);closePanel();await w(600);ck('#m2 [data-v="sales"]');
  go(3);await w(3800);ck('#m3 [data-v="0"]');await w(2000);ck('#m3 [data-v="1"]');await w(1800);ck(PG[3].W.bars[2]);await w(2600);closePanel();await w(500);
  go(4);await w(3400);ck("#pl4");await w(4200);go(5);await w(3600);ck("#pl5");await w(4000);
  go(6);await w(3800);ck('#m6 [data-v="1"]');await w(2000);ck('#m6 [data-v="2"]');await w(1800);ck(PG[6].W.bars[3]);await w(2600);closePanel();await w(500);
  go(7);await w(3600);await slide("sg",10);await w(700);await slide("sm",Math.max(0,M0-2));await w(700);await slide("sf",3);await w(1200);await slide("sg",0);await slide("sm",M0);await slide("sf",0);await w(1000)}catch(e){}
 stopDemo()}
/* ---------- 起動 ---------- */
function setStatic(){STATIC=location.hash==="#static"||matchMedia("(prefers-reduced-motion: reduce)").matches;document.body.classList.toggle("static",STATIC)}
document.title=document.title||`${NAME} ${PD[2]} 決算のご報告`;
PG.forEach(p=>p.build());setStatic();fit();addEventListener("resize",fit);
secs[0].classList.add("on");nav();PG[0].enter();
function layoutChk(){for(let n=1;n<8;n++){const h=$("h2",secs[n]);if(h&&h.scrollWidth>h.clientWidth+2)warn("要修正",`${n}ページの見出しが1行に収まりません（はみ出し ${h.scrollWidth-h.clientWidth}px）「${h.textContent}」`)}
 const cv=$(".cv-c",secs[0]);if(cv&&cv.offsetHeight>130)warn("要修正",`表紙の結論が3行以上になっています「${cv.textContent}」`);
 $$(".card",secs[1]).forEach((e,i)=>{if(e.scrollHeight>e.clientHeight+2)warn("要修正",`カード${i+1}の一言が枠に収まりません「${e.textContent}」`)});
 const b2=$(".box .bs",secs[2]),b5=$(".box .bs",secs[5]);[[b2,"売上と利益の「言えること」"],[b5,"財務体質の「言えること」"]].forEach(([e,nm])=>{if(e&&e.offsetHeight>200)warn("要確認",`${nm}が長すぎます（5行を超えています）`)});
 showChk()}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(layoutChk,300));
addEventListener("hashchange",()=>{setStatic();RUN++;PG[cur].enter()});
addEventListener("beforeprint",()=>{const s=STATIC;STATIC=true;document.body.classList.add("static");RUN++;closePanel();PG.forEach((p,i)=>{const c=cur;cur=i;p.enter();cur=c});STATIC=s;if(!s)document.body.classList.remove("static")});
window.KESSAN_CHECK=()=>WARN.slice();
})();
