(()=>{var e={};e.id=9226,e.ids=[9226],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},83572:(e,o,r)=>{"use strict";r.r(o),r.d(o,{GlobalError:()=>l.a,__next_app__:()=>m,originalPathname:()=>p,pages:()=>c,routeModule:()=>h,tree:()=>d}),r(63867),r(6371),r(73469),r(37204),r(90938),r(50231);var t=r(93282),s=r(5736),a=r(93906),l=r.n(a),n=r(36880),i={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(i[e]=()=>n[e]);r.d(o,i);let d=["",{children:["tools",{children:["md-to-html",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,63867)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/md-to-html/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,6371)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/layout.tsx"],error:[()=>Promise.resolve().then(r.bind(r,73469)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/error.tsx"],loading:[()=>Promise.resolve().then(r.bind(r,37204)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/loading.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,90938)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.bind(r,50231)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/not-found.tsx"]}],c=["/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/md-to-html/page.tsx"],p="/tools/md-to-html/page",m={require:r,loadChunk:()=>Promise.resolve()},h=new t.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/tools/md-to-html/page",pathname:"/tools/md-to-html",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},95268:(e,o,r)=>{Promise.resolve().then(r.bind(r,62716))},75908:(e,o,r)=>{Promise.resolve().then(r.bind(r,48542)),Promise.resolve().then(r.bind(r,75372))},73245:()=>{},62716:(e,o,r)=>{"use strict";r.r(o),r.d(o,{default:()=>s});var t=r(73227);function s({error:e,reset:o}){return(0,t.jsxs)("div",{className:"page-error-wrap",children:[t.jsx("h2",{className:"page-error-title",children:"Something went wrong"}),t.jsx("p",{className:"page-error-desc",children:e?.message&&e.message.length<200?e.message:"Unable to load tools."}),(0,t.jsxs)("div",{className:"page-error-actions",children:[t.jsx("button",{type:"button",onClick:o,children:"Try again"}),t.jsx("a",{href:"/",children:"Go home"})]})]})}r(23677)},48542:(e,o,r)=>{"use strict";r.d(o,{default:()=>l});var t=r(73227),s=r(23677);let a=`# Hello, World!

This is **bold** and _italic_ text.

## Features

- Item one
- Item two
- Item three

1. First
2. Second

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
\`\`\`

> A blockquote example.

[Visit WokGen](https://wokgen.dev)
`;function l(){let[e,o]=(0,s.useState)(a),[r,l]=(0,s.useState)(""),[n,i]=(0,s.useState)("preview"),[d,c]=(0,s.useState)(!1);return(0,t.jsxs)("div",{className:"md2h-tool",children:[(0,t.jsxs)("div",{className:"md2h-tool__panes",children:[(0,t.jsxs)("div",{className:"md2h-tool__pane",children:[t.jsx("div",{className:"md2h-tool__pane-header",children:"Markdown Input"}),t.jsx("textarea",{className:"md2h-tool__textarea",value:e,onChange:e=>o(e.target.value),spellCheck:!1})]}),(0,t.jsxs)("div",{className:"md2h-tool__pane",children:[(0,t.jsxs)("div",{className:"md2h-tool__pane-header",children:[(0,t.jsxs)("div",{className:"md2h-tool__tabs",children:[t.jsx("button",{className:`md2h-tool__tab ${"preview"===n?"active":""}`,onClick:()=>i("preview"),children:"Preview"}),t.jsx("button",{className:`md2h-tool__tab ${"code"===n?"active":""}`,onClick:()=>i("code"),children:"HTML Code"})]}),t.jsx("button",{className:"btn btn-sm",onClick:()=>{navigator.clipboard.writeText(r).then(()=>{c(!0),setTimeout(()=>c(!1),2e3)})},children:d?"Copied!":"Copy HTML"})]}),"preview"===n?t.jsx("div",{className:"md2h-tool__preview",dangerouslySetInnerHTML:{__html:r}}):t.jsx("pre",{className:"md2h-tool__code",children:r})]})]}),t.jsx("style",{children:`
        .md2h-tool { display: flex; flex-direction: column; gap: 12px; }
        .md2h-tool__panes { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 700px) { .md2h-tool__panes { grid-template-columns: 1fr; } }
        .md2h-tool__pane {
          background: var(--bg-surface); border: 1px solid var(--surface-border);
          border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;
        }
        .md2h-tool__pane-header {
          padding: 8px 12px; background: var(--bg); border-bottom: 1px solid var(--surface-border);
          font-size: 12px; font-weight: 600; color: var(--text-secondary);
          display: flex; justify-content: space-between; align-items: center;
        }
        .md2h-tool__tabs { display: flex; gap: 4px; }
        .md2h-tool__tab {
          padding: 3px 10px; font-size: 12px; border-radius: 4px; cursor: pointer;
          background: none; border: 1px solid transparent; color: var(--text-muted);
        }
        .md2h-tool__tab.active { background: var(--accent-glow); border-color: var(--accent); color: var(--accent); }
        .md2h-tool__textarea {
          flex: 1; padding: 14px; font-size: 13px; font-family: 'Menlo','Consolas',monospace;
          background: var(--bg-surface); color: var(--text); border: none; outline: none;
          resize: none; min-height: 420px;
        }
        .md2h-tool__preview {
          padding: 16px; min-height: 420px; overflow-y: auto; color: var(--text);
          line-height: 1.6; font-size: 14px;
        }
        .md2h-tool__preview h1,.md2h-tool__preview h2,.md2h-tool__preview h3,
        .md2h-tool__preview h4,.md2h-tool__preview h5,.md2h-tool__preview h6 {
          margin: 12px 0 6px; font-weight: 700;
        }
        .md2h-tool__preview h1 { font-size: 1.6em; }
        .md2h-tool__preview h2 { font-size: 1.3em; }
        .md2h-tool__preview h3 { font-size: 1.1em; }
        .md2h-tool__preview p { margin: 0 0 8px; }
        .md2h-tool__preview ul,.md2h-tool__preview ol { padding-left: 20px; margin: 0 0 8px; }
        .md2h-tool__preview li { margin: 2px 0; }
        .md2h-tool__preview code {
          background: var(--accent-glow); padding: 2px 5px; border-radius: 3px;
          font-family: 'Menlo','Consolas',monospace; font-size: 12px;
        }
        .md2h-tool__preview pre {
          background: var(--bg); padding: 12px; border-radius: 6px; overflow-x: auto;
          margin: 0 0 10px;
        }
        .md2h-tool__preview pre code { background: none; padding: 0; }
        .md2h-tool__preview blockquote {
          border-left: 3px solid #818cf8; padding-left: 12px; color: var(--text-secondary);
          margin: 0 0 10px;
        }
        .md2h-tool__preview a { color: var(--accent); text-decoration: underline; }
        .md2h-tool__preview hr { border: none; border-top: 1px solid var(--surface-border); margin: 12px 0; }
        .md2h-tool__code {
          padding: 14px; font-size: 12px; font-family: 'Menlo','Consolas',monospace;
          color: var(--text); white-space: pre-wrap; word-break: break-all;
          overflow-y: auto; min-height: 420px; margin: 0;
        }
        .btn.btn-sm { padding: 4px 10px; font-size: 11px; cursor: pointer; background: var(--surface-raised); border: 1px solid var(--surface-border); color: var(--text); border-radius: 4px; white-space: nowrap; }
        .btn.btn-sm:hover { background: var(--surface-hover); }
      `})]})}},75372:(e,o,r)=>{"use strict";r.d(o,{default:()=>a});var t=r(73227),s=r(20649);function a({id:e,label:o,description:r,icon:a,children:l,comingSoon:n}){return(0,t.jsxs)("div",{className:"tool-shell",children:[(0,t.jsxs)("nav",{className:"tool-shell-breadcrumb","aria-label":"Breadcrumb",children:[t.jsx(s.default,{href:"/tools",className:"tool-shell-bc-link",children:"← Tools"}),t.jsx("span",{className:"tool-shell-bc-sep","aria-hidden":"true",children:"/"}),t.jsx("span",{className:"tool-shell-bc-current",children:o})]}),(0,t.jsxs)("header",{className:"tool-shell-header",children:[t.jsx("div",{className:"tool-shell-icon","aria-hidden":"true",children:t.jsx("span",{className:"tool-shell-icon-badge",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:40,height:40,borderRadius:6,background:"var(--surface-card)",color:"#fff",fontFamily:"monospace",fontSize:12,border:"1px solid var(--surface-raised)"},children:String(a).trim().slice(0,3)})}),(0,t.jsxs)("div",{className:"tool-shell-header-text",children:[t.jsx("h1",{className:"tool-shell-title",children:o}),t.jsx("p",{className:"tool-shell-desc",children:r})]})]}),t.jsx("div",{className:"tool-shell-body",children:n||!l?(0,t.jsxs)("div",{className:"tool-shell-soon",children:[t.jsx("h2",{className:"tool-shell-soon-title",children:"Coming Soon"}),(0,t.jsxs)("p",{className:"tool-shell-soon-desc",children:["This tool is in development. Check back soon or"," ",t.jsx("a",{href:"https://github.com/WokSpec/WokGen/issues",target:"_blank",rel:"noopener noreferrer",className:"tool-link",children:"request a feature on GitHub"}),"."]}),t.jsx(s.default,{href:"/tools",className:"btn-primary tool-shell-back-btn",children:"← Back to Tools"})]}):l})]})}},73469:(e,o,r)=>{"use strict";r.r(o),r.d(o,{default:()=>t});let t=(0,r(53189).createProxy)(String.raw`/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/error.tsx#default`)},6371:(e,o,r)=>{"use strict";r.r(o),r.d(o,{default:()=>a,metadata:()=>s});var t=r(99013);let s={title:{template:"%s — Tools \xb7 WokGen",default:"Free Creator Tools — WokGen"},description:"Browser-native tools for creators, developers, and game devs. Background remover, image converter, CSS generator, JSON toolkit, PDF tools, and 30+ more. All free, all private — processing happens in your browser.",openGraph:{type:"website",siteName:"WokGen",images:[{url:"/og-tools.png",width:1200,height:630}]},twitter:{card:"summary_large_image",site:"@WokSpec"}};function a({children:e}){return t.jsx(t.Fragment,{children:e})}},37204:(e,o,r)=>{"use strict";r.r(o),r.d(o,{default:()=>s});var t=r(99013);function s(){return(0,t.jsxs)("div",{className:"tool-page-root page-loading-wrap",children:[(0,t.jsxs)("div",{className:"tool-page-header",children:[t.jsx("div",{className:"page-loading-skeleton tl-title"}),t.jsx("div",{className:"page-loading-skeleton tl-subtitle"})]}),t.jsx("div",{className:"tool-section",children:t.jsx("div",{className:"page-loading-skeleton tl-search"})})]})}},63867:(e,o,r)=>{"use strict";r.r(o),r.d(o,{default:()=>n,metadata:()=>l});var t=r(99013),s=r(36632);let a=(0,r(53189).createProxy)(String.raw`/home/user9007/main/projects/wokspec/WokTool/apps/web/src/components/tools/MdToHtmlTool.tsx#default`),l={title:"Markdown to HTML — WokGen",description:"Paste Markdown and get rendered HTML with a live preview. Client-side, no upload needed."};function n(){return t.jsx(s.Z,{id:"md-to-html",label:"Markdown to HTML",description:"Paste Markdown and get rendered HTML with a live preview. Client-side, no upload needed.",icon:"MD",children:t.jsx(a,{})})}},36632:(e,o,r)=>{"use strict";r.d(o,{Z:()=>t});let t=(0,r(53189).createProxy)(String.raw`/home/user9007/main/projects/wokspec/WokTool/apps/web/src/components/tools/ToolShell.tsx#default`)}};var o=require("../../../webpack-runtime.js");o.C(e);var r=e=>o(o.s=e),t=o.X(0,[4522,4991,4437],()=>r(83572));module.exports=t})();