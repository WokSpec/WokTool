(()=>{var e={};e.id=1819,e.ids=[1819],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},32115:(e,o,t)=>{"use strict";t.r(o),t.d(o,{GlobalError:()=>i.a,__next_app__:()=>u,originalPathname:()=>d,pages:()=>p,routeModule:()=>m,tree:()=>c}),t(75046),t(6371),t(73469),t(37204),t(90938),t(50231);var a=t(93282),s=t(5736),r=t(93906),i=t.n(r),l=t(36880),n={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(n[e]=()=>l[e]);t.d(o,n);let c=["",{children:["tools",{children:["privacy-policy",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,75046)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/privacy-policy/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,6371)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/layout.tsx"],error:[()=>Promise.resolve().then(t.bind(t,73469)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/error.tsx"],loading:[()=>Promise.resolve().then(t.bind(t,37204)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/loading.tsx"]}]},{layout:[()=>Promise.resolve().then(t.bind(t,90938)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.bind(t,50231)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/not-found.tsx"]}],p=["/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/privacy-policy/page.tsx"],d="/tools/privacy-policy/page",u={require:t,loadChunk:()=>Promise.resolve()},m=new a.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/tools/privacy-policy/page",pathname:"/tools/privacy-policy",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},95268:(e,o,t)=>{Promise.resolve().then(t.bind(t,62716))},79115:(e,o,t)=>{Promise.resolve().then(t.bind(t,67259)),Promise.resolve().then(t.bind(t,75372))},73245:()=>{},62716:(e,o,t)=>{"use strict";t.r(o),t.d(o,{default:()=>s});var a=t(73227);function s({error:e,reset:o}){return(0,a.jsxs)("div",{className:"page-error-wrap",children:[a.jsx("h2",{className:"page-error-title",children:"Something went wrong"}),a.jsx("p",{className:"page-error-desc",children:e?.message&&e.message.length<200?e.message:"Unable to load tools."}),(0,a.jsxs)("div",{className:"page-error-actions",children:[a.jsx("button",{type:"button",onClick:o,children:"Try again"}),a.jsx("a",{href:"/",children:"Go home"})]})]})}t(23677)},67259:(e,o,t)=>{"use strict";t.d(o,{default:()=>l});var a=t(73227),s=t(23677);let r=[{id:"name",label:"Name"},{id:"email",label:"Email address"},{id:"ip",label:"IP address"},{id:"cookies",label:"Cookies / tracking data"},{id:"payment",label:"Payment information"},{id:"analytics",label:"Usage analytics"}],i={US:"applicable US federal and state privacy laws",EU:"the General Data Protection Regulation (GDPR)",UK:"the UK GDPR and Data Protection Act 2018",AU:"the Australian Privacy Act 1988"};function l(){let[e,o]=(0,s.useState)({company:"",website:"",email:"",dataCollected:["email","name","cookies"],jurisdiction:"US"}),[t,l]=(0,s.useState)(""),[n,c]=(0,s.useState)(!1),p=e=>{o(o=>({...o,dataCollected:o.dataCollected.includes(e)?o.dataCollected.filter(o=>o!==e):[...o.dataCollected,e]}))},d=async()=>{try{await navigator.clipboard.writeText(t),c(!0),setTimeout(()=>c(!1),2e3)}catch{}};return(0,a.jsxs)("div",{className:"pp-tool",children:[(0,a.jsxs)("div",{className:"pp-tool__form",children:[(0,a.jsxs)("div",{className:"pp-tool__row",children:[(0,a.jsxs)("label",{className:"pp-tool__field",children:[a.jsx("span",{children:"Company / Website Name"}),a.jsx("input",{value:e.company,onChange:e=>o(o=>({...o,company:e.target.value})),placeholder:"Acme Inc."})]}),(0,a.jsxs)("label",{className:"pp-tool__field",children:[a.jsx("span",{children:"Website URL"}),a.jsx("input",{value:e.website,onChange:e=>o(o=>({...o,website:e.target.value})),placeholder:"https://example.com"})]})]}),(0,a.jsxs)("div",{className:"pp-tool__row",children:[(0,a.jsxs)("label",{className:"pp-tool__field",children:[a.jsx("span",{children:"Contact Email"}),a.jsx("input",{type:"email",value:e.email,onChange:e=>o(o=>({...o,email:e.target.value})),placeholder:"privacy@example.com"})]}),(0,a.jsxs)("label",{className:"pp-tool__field",children:[a.jsx("span",{children:"Jurisdiction"}),(0,a.jsxs)("select",{value:e.jurisdiction,onChange:e=>o(o=>({...o,jurisdiction:e.target.value})),children:[a.jsx("option",{value:"US",children:"United States"}),a.jsx("option",{value:"EU",children:"European Union (GDPR)"}),a.jsx("option",{value:"UK",children:"United Kingdom"}),a.jsx("option",{value:"AU",children:"Australia"})]})]})]}),a.jsx("div",{className:"pp-tool__checks-label",children:"Data Collected"}),a.jsx("div",{className:"pp-tool__checks",children:r.map(o=>(0,a.jsxs)("label",{className:"pp-tool__check",children:[a.jsx("input",{type:"checkbox",checked:e.dataCollected.includes(o.id),onChange:()=>p(o.id)}),o.label]},o.id))}),a.jsx("button",{className:"btn btn-primary",onClick:()=>l(function(e){let o=e.website||"our website",t=e.company||"We",a=e.email||"contact@example.com",s=i[e.jurisdiction],l=e.dataCollected.length?e.dataCollected.map(e=>r.find(o=>o.id===e)?.label??e).join(", "):"information you voluntarily provide";return`PRIVACY POLICY
Last updated: ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}

1. INTRODUCTION
${t} ("we", "us", or "our") operates ${o}. This Privacy Policy explains how we collect, use, and protect your personal information in accordance with ${s}.

2. INFORMATION WE COLLECT
We may collect the following types of information: ${l}.

We collect information in the following ways:
- Information you provide directly (e.g., contact forms, account registration)
- Automatically via cookies and similar tracking technologies
- From third-party services and partners

3. HOW WE USE YOUR INFORMATION
We use the information we collect to:
- Provide, operate, and maintain our services
- Improve and personalise your experience
- Process transactions and send related information
- Send administrative information, updates, and security alerts
- Respond to comments and questions
- Comply with legal obligations

4. SHARING YOUR INFORMATION
We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website, provided they agree to keep it confidential.

We may disclose information when required by law or to protect our rights and safety.

5. COOKIES
${e.dataCollected.includes("cookies")?"We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.":"We use only essential cookies necessary for the website to function correctly."}

6. DATA RETENTION
We retain your personal data only for as long as necessary to fulfil the purposes described in this policy, unless a longer retention period is required by law.

7. YOUR RIGHTS
${"EU"===e.jurisdiction||"UK"===e.jurisdiction?`Under ${s}, you have the right to: access, correct, delete, restrict processing of, and port your personal data. You also have the right to object to processing and to withdraw consent at any time.`:"You may request access to, correction of, or deletion of your personal information by contacting us."}

To exercise any of these rights, please contact us at ${a}.

8. DATA SECURITY
We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.

9. THIRD-PARTY LINKS
Our website may contain links to third-party sites. We are not responsible for the privacy practices of those sites and encourage you to read their privacy policies.

10. CHILDREN'S PRIVACY
Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children.

11. CHANGES TO THIS POLICY
We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Changes are effective immediately upon posting.

12. CONTACT US
If you have questions about this Privacy Policy, please contact us at:
${t}
${e.website?o+"\n":""}Email: ${a}
`}(e)),children:"Generate Privacy Policy"})]}),t&&(0,a.jsxs)("div",{className:"pp-tool__output",children:[(0,a.jsxs)("div",{className:"pp-tool__output-header",children:[a.jsx("span",{className:"pp-tool__output-title",children:"Generated Policy"}),(0,a.jsxs)("div",{className:"pp-tool__output-btns",children:[a.jsx("button",{className:"btn btn-sm",onClick:d,children:n?"Copied!":"Copy"}),a.jsx("button",{className:"btn btn-sm",onClick:()=>{let e=new Blob([t],{type:"text/plain"}),o=document.createElement("a");o.href=URL.createObjectURL(e),o.download="privacy-policy.txt",o.click(),URL.revokeObjectURL(o.href)},children:"Download .txt"})]})]}),a.jsx("pre",{className:"pp-tool__preview",children:t})]}),a.jsx("style",{children:`
        .pp-tool { display: flex; flex-direction: column; gap: 20px; }
        .pp-tool__form {
          background: var(--bg-surface); border: 1px solid var(--surface-border);
          border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 14px;
        }
        .pp-tool__row { display: flex; gap: 12px; flex-wrap: wrap; }
        .pp-tool__field { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 160px; font-size: 12px; color: var(--text-secondary); }
        .pp-tool__field input, .pp-tool__field select {
          background: var(--bg); border: 1px solid var(--surface-border); border-radius: 4px;
          color: var(--text); padding: 6px 8px; font-size: 13px;
        }
        .pp-tool__checks-label { font-size: 12px; color: var(--text-secondary); font-weight: 500; }
        .pp-tool__checks { display: flex; flex-wrap: wrap; gap: 10px; }
        .pp-tool__check { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer; user-select: none; }
        .pp-tool__output {
          background: var(--bg-surface); border: 1px solid var(--surface-border); border-radius: 8px; overflow: hidden;
        }
        .pp-tool__output-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--surface-border); }
        .pp-tool__output-title { font-size: 13px; font-weight: 600; color: var(--text); }
        .pp-tool__output-btns { display: flex; gap: 8px; }
        .pp-tool__preview { padding: 16px; font-size: 12px; white-space: pre-wrap; word-break: break-word; color: var(--text); max-height: 480px; overflow-y: auto; margin: 0; }
        .btn.btn-sm { padding: 5px 12px; font-size: 12px; cursor: pointer; background: var(--surface-raised); border: 1px solid var(--surface-border); color: var(--text); border-radius: 4px; }
        .btn.btn-sm:hover { background: var(--surface-hover); }
      `})]})}},75372:(e,o,t)=>{"use strict";t.d(o,{default:()=>r});var a=t(73227),s=t(20649);function r({id:e,label:o,description:t,icon:r,children:i,comingSoon:l}){return(0,a.jsxs)("div",{className:"tool-shell",children:[(0,a.jsxs)("nav",{className:"tool-shell-breadcrumb","aria-label":"Breadcrumb",children:[a.jsx(s.default,{href:"/tools",className:"tool-shell-bc-link",children:"← Tools"}),a.jsx("span",{className:"tool-shell-bc-sep","aria-hidden":"true",children:"/"}),a.jsx("span",{className:"tool-shell-bc-current",children:o})]}),(0,a.jsxs)("header",{className:"tool-shell-header",children:[a.jsx("div",{className:"tool-shell-icon","aria-hidden":"true",children:a.jsx("span",{className:"tool-shell-icon-badge",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:40,height:40,borderRadius:6,background:"var(--surface-card)",color:"#fff",fontFamily:"monospace",fontSize:12,border:"1px solid var(--surface-raised)"},children:String(r).trim().slice(0,3)})}),(0,a.jsxs)("div",{className:"tool-shell-header-text",children:[a.jsx("h1",{className:"tool-shell-title",children:o}),a.jsx("p",{className:"tool-shell-desc",children:t})]})]}),a.jsx("div",{className:"tool-shell-body",children:l||!i?(0,a.jsxs)("div",{className:"tool-shell-soon",children:[a.jsx("h2",{className:"tool-shell-soon-title",children:"Coming Soon"}),(0,a.jsxs)("p",{className:"tool-shell-soon-desc",children:["This tool is in development. Check back soon or"," ",a.jsx("a",{href:"https://github.com/WokSpec/WokGen/issues",target:"_blank",rel:"noopener noreferrer",className:"tool-link",children:"request a feature on GitHub"}),"."]}),a.jsx(s.default,{href:"/tools",className:"btn-primary tool-shell-back-btn",children:"← Back to Tools"})]}):i})]})}},73469:(e,o,t)=>{"use strict";t.r(o),t.d(o,{default:()=>a});let a=(0,t(53189).createProxy)(String.raw`/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/error.tsx#default`)},6371:(e,o,t)=>{"use strict";t.r(o),t.d(o,{default:()=>r,metadata:()=>s});var a=t(99013);let s={title:{template:"%s — Tools \xb7 WokGen",default:"Free Creator Tools — WokGen"},description:"Browser-native tools for creators, developers, and game devs. Background remover, image converter, CSS generator, JSON toolkit, PDF tools, and 30+ more. All free, all private — processing happens in your browser.",openGraph:{type:"website",siteName:"WokGen",images:[{url:"/og-tools.png",width:1200,height:630}]},twitter:{card:"summary_large_image",site:"@WokSpec"}};function r({children:e}){return a.jsx(a.Fragment,{children:e})}},37204:(e,o,t)=>{"use strict";t.r(o),t.d(o,{default:()=>s});var a=t(99013);function s(){return(0,a.jsxs)("div",{className:"tool-page-root page-loading-wrap",children:[(0,a.jsxs)("div",{className:"tool-page-header",children:[a.jsx("div",{className:"page-loading-skeleton tl-title"}),a.jsx("div",{className:"page-loading-skeleton tl-subtitle"})]}),a.jsx("div",{className:"tool-section",children:a.jsx("div",{className:"page-loading-skeleton tl-search"})})]})}},75046:(e,o,t)=>{"use strict";t.r(o),t.d(o,{default:()=>l,metadata:()=>i});var a=t(99013),s=t(36632);let r=(0,t(53189).createProxy)(String.raw`/home/user9007/main/projects/wokspec/WokTool/apps/web/src/components/tools/PrivacyPolicyTool.tsx#default`),i={title:"Privacy Policy Generator — WokGen",description:"Generate a privacy policy for your website from a simple form. Copy or download as .txt."};function l(){return a.jsx(s.Z,{id:"privacy-policy",label:"Privacy Policy Generator",description:"Generate a privacy policy for your website from a simple form. Copy or download as .txt.",icon:"PP",children:a.jsx(r,{})})}},36632:(e,o,t)=>{"use strict";t.d(o,{Z:()=>a});let a=(0,t(53189).createProxy)(String.raw`/home/user9007/main/projects/wokspec/WokTool/apps/web/src/components/tools/ToolShell.tsx#default`)}};var o=require("../../../webpack-runtime.js");o.C(e);var t=e=>o(o.s=e),a=o.X(0,[4522,4991,4437],()=>t(32115));module.exports=a})();