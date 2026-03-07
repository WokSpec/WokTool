(()=>{var e={};e.id=2917,e.ids=[2917],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},68624:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>n.a,__next_app__:()=>x,originalPathname:()=>p,pages:()=>d,routeModule:()=>h,tree:()=>c}),s(84576),s(6371),s(73469),s(37204),s(90938),s(50231);var r=s(93282),a=s(5736),i=s(93906),n=s.n(i),o=s(36880),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);s.d(t,l);let c=["",{children:["tools",{children:["nginx-config",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,84576)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/nginx-config/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,6371)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/layout.tsx"],error:[()=>Promise.resolve().then(s.bind(s,73469)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/error.tsx"],loading:[()=>Promise.resolve().then(s.bind(s,37204)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/loading.tsx"]}]},{layout:[()=>Promise.resolve().then(s.bind(s,90938)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.bind(s,50231)),"/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/not-found.tsx"]}],d=["/home/user9007/main/projects/wokspec/WokTool/apps/web/src/app/tools/nginx-config/page.tsx"],p="/tools/nginx-config/page",x={require:s,loadChunk:()=>Promise.resolve()},h=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/tools/nginx-config/page",pathname:"/tools/nginx-config",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},630:(e,t,s)=>{Promise.resolve().then(s.bind(s,32071)),Promise.resolve().then(s.bind(s,75372)),Promise.resolve().then(s.bind(s,13307)),Promise.resolve().then(s.bind(s,12014))},32071:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>p});var r=s(73227),a=s(23677),i=s(46601),n=s(13756),o=s(4684),l=s(79302),c=s(60276),d=s(57173);function p(){let[e,t]=(0,a.useState)("example.com"),[s,p]=(0,a.useState)("static"),[x,h]=(0,a.useState)("letsencrypt"),[u,m]=(0,a.useState)("/var/www/html"),[g,b]=(0,a.useState)("http://localhost:3000"),[f,v]=(0,a.useState)(!0),[w,y]=(0,a.useState)(!1),[j,_]=(0,a.useState)(!0),[k,N]=(0,a.useState)(!0),$=(0,a.useMemo)(()=>(function(e){let{domain:t,serverType:s,ssl:r,rootPath:a,proxyPass:i,gzip:n,rateLimit:o,securityHeaders:l,wwwRedirect:c}=e,d=t||"example.com",p=a||"/var/www/html",x="";return o&&(x+=`# Rate limiting zone
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

`),c&&(x+=`server {
    listen 80;
    server_name www.${d};
    return 301 $scheme://${d}$request_uri;
}

`,"none"!==r&&(x+=`server {
    listen 443 ssl http2;
    server_name www.${d};
`,"letsencrypt"===r&&(x+=`    ssl_certificate /etc/letsencrypt/live/${d}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${d}/privkey.pem;
`),x+=`    return 301 https://${d}$request_uri;
}

`)),"none"!==r&&(x+=`server {
    listen 80;
    server_name ${d};
    return 301 https://$host$request_uri;
}

`),x+=`server {
`,"none"!==r?x+=`    listen 443 ssl http2;
    listen [::]:443 ssl http2;
`:x+=`    listen 80;
    listen [::]:80;
`,x+=`    server_name ${d};

`,"letsencrypt"===r?x+=`    # SSL — Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/${d}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${d}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

`:"custom"===r&&(x+=`    # SSL — Custom Certificate
    ssl_certificate /etc/ssl/certs/${d}.crt;
    ssl_certificate_key /etc/ssl/private/${d}.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

`),n&&(x+=`    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

`),l&&(x+=`    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

`),o&&(x+=`    # Rate limiting
    limit_req zone=one burst=20 nodelay;

`),"static"===s?x+=`    root ${p};
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
`:"proxy"===s||"node"===s?x+=`    location / {
        proxy_pass ${i||"http://localhost:3000"};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
`:"php"===s&&(x+=`    root ${p};
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\\.ht {
        deny all;
    }
`),x+=`}
`})({domain:e,serverType:s,ssl:x,rootPath:u,proxyPass:g,gzip:f,rateLimit:w,securityHeaders:j,wwwRedirect:k}),[e,s,x,u,g,f,w,j,k]);return r.jsx("div",{className:"space-y-8 animate-in fade-in duration-500",children:(0,r.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[(0,r.jsxs)("div",{className:"space-y-6",children:[r.jsx(i.Z,{title:"Server Details",children:(0,r.jsxs)("div",{className:"space-y-4",children:[r.jsx(n.Z,{label:"Domain Name",value:e,onChange:e=>t(e.target.value),placeholder:"example.com"}),r.jsx(o.Z,{label:"Server Type",value:s,onChange:e=>p(e.target.value),options:[{value:"static",label:"Static Site"},{value:"proxy",label:"Reverse Proxy"},{value:"php",label:"PHP (FastCGI)"},{value:"node",label:"Node.js App"}]}),r.jsx(o.Z,{label:"SSL / HTTPS",value:x,onChange:e=>h(e.target.value),options:[{value:"letsencrypt",label:"Let's Encrypt (Certbot)"},{value:"custom",label:"Custom Certificate"},{value:"none",label:"No SSL (HTTP only)"}]})]})}),("static"===s||"php"===s)&&r.jsx(i.Z,{title:"Path Settings",children:r.jsx(n.Z,{label:"Root Path",value:u,onChange:e=>m(e.target.value),placeholder:"/var/www/html"})}),("proxy"===s||"node"===s)&&r.jsx(i.Z,{title:"Proxy Settings",children:r.jsx(n.Z,{label:"Proxy Pass URL",value:g,onChange:e=>b(e.target.value),placeholder:"http://localhost:3000"})}),r.jsx(i.Z,{title:"Optimization & Security",children:(0,r.jsxs)("div",{className:"space-y-4",children:[r.jsx(d.Z,{label:"Gzip Compression",checked:f,onChange:v}),r.jsx(d.Z,{label:"Security Headers",checked:j,onChange:_}),r.jsx(d.Z,{label:"Rate Limiting",checked:w,onChange:y}),r.jsx(d.Z,{label:"WWW Redirect",checked:k,onChange:N})]})})]}),(0,r.jsxs)("div",{className:"lg:col-span-2 space-y-6",children:[(0,r.jsxs)("div",{className:"flex justify-between items-center px-1",children:[r.jsx("h3",{className:"text-xs font-bold uppercase tracking-widest text-white/40",children:"Generated nginx.conf"}),r.jsx(l.Z,{variant:"ghost",size:"sm",onClick:()=>navigator.clipboard.writeText($),className:"h-7 text-[10px]",children:"Copy Config"})]}),r.jsx(c.Z,{code:$,language:"nginx",maxHeight:"600px"}),(0,r.jsxs)("div",{className:"p-6 rounded-3xl bg-accent/5 border border-accent/10 flex gap-4 items-start",children:[r.jsx("div",{className:"w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 font-bold",children:"!"}),(0,r.jsxs)("p",{className:"text-xs text-white/40 leading-relaxed",children:["This tool generates a standard server block. Ensure you have ",r.jsx("code",{children:"nginx"})," installed and place this configuration in your ",r.jsx("code",{children:"/etc/nginx/sites-available/"})," directory."]})]})]})]})})}},79302:(e,t,s)=>{"use strict";s.d(t,{Z:()=>o});var r=s(73227),a=s(23677),i=s(20649);let n=(0,a.forwardRef)(({className:e="",variant:t="primary",size:s="md",href:a,loading:n,icon:o,children:l,download:c,target:d,type:p="button",...x},h)=>{let u=`inline-flex items-center justify-center font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2.5 cursor-pointer no-underline tracking-tight ${{primary:"bg-white text-black hover:bg-[#e2e2e2] shadow-[0_0_20px_rgba(255,255,255,0.1)]",secondary:"bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.06] hover:border-white/[0.15]",ghost:"bg-transparent text-zinc-500 hover:text-white hover:bg-white/[0.03]",danger:"bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"}[t]} ${{sm:"text-[11px] px-4 py-1.5 uppercase tracking-widest",md:"text-[13px] px-6 py-2.5",lg:"text-[15px] px-8 py-3.5"}[s]} ${e}`,m=(0,r.jsxs)(r.Fragment,{children:[n&&(0,r.jsxs)("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-current",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[r.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),r.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),!n&&o&&r.jsx("span",{className:"opacity-70",children:o}),l]});return a&&(c||"_blank"===d||a.startsWith("http")||a.startsWith("blob:"))?r.jsx("a",{href:a,className:u,ref:h,download:c,target:d,...x,children:m}):a?r.jsx(i.default,{href:a,className:u,ref:h,...x,children:m}):r.jsx("button",{type:p,className:u,ref:h,disabled:n||x.disabled,...x,children:m})});n.displayName="Button";let o=n},46601:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});var r=s(73227);function a({children:e,className:t="",title:s,description:a}){return(0,r.jsxs)("div",{className:`group relative bg-[#050505] border border-white/[0.06] rounded-[1.5rem] p-6 transition-all duration-500 hover:border-white/[0.15] hover:shadow-[0_0_40px_rgba(255,255,255,0.01)] ${t}`,children:[r.jsx("div",{className:"absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"}),(s||a)&&(0,r.jsxs)("div",{className:"relative mb-6",children:[s&&r.jsx("h3",{className:"text-sm font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5",children:s}),a&&r.jsx("p",{className:"text-[13px] text-zinc-600 font-medium leading-relaxed",children:a})]}),r.jsx("div",{className:"relative",children:e})]})}},60276:(e,t,s)=>{"use strict";s.d(t,{Z:()=>o});var r=s(73227),a=s(23677),i=s(56942),n=s(90931);function o({code:e,language:t="text",label:s,maxHeight:o="400px"}){let[l,c]=(0,a.useState)(!1);return(0,r.jsxs)("div",{className:"relative group rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/[0.08] shadow-2xl",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between px-5 py-2.5 bg-white/[0.03] border-b border-white/[0.06]",children:[(0,r.jsxs)("div",{className:"flex items-center gap-3",children:[s&&r.jsx("span",{className:"text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]",children:s}),r.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-accent font-mono uppercase font-bold",children:t})]}),(0,r.jsxs)("button",{onClick:()=>{navigator.clipboard.writeText(e),c(!0),setTimeout(()=>c(!1),2e3)},className:`
            text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg transition-all flex items-center gap-2
            ${l?"text-emerald-400 bg-emerald-500/10":"text-zinc-500 hover:text-white hover:bg-white/5"}
          `,children:[l?r.jsx(i.Z,{size:12,strokeWidth:3}):r.jsx(n.Z,{size:12,strokeWidth:2}),l?"Copied":"Copy"]})]}),r.jsx("div",{className:"overflow-auto custom-scrollbar",style:{maxHeight:o},children:r.jsx("pre",{className:"p-6 font-mono text-[13px] text-zinc-300 leading-relaxed whitespace-pre-wrap break-all selection:bg-accent/30 selection:text-white",children:e})})]})}},13756:(e,t,s)=>{"use strict";s.d(t,{Z:()=>i});var r=s(73227);let a=(0,s(23677).forwardRef)(({label:e,error:t,helper:s,className:a="",leftIcon:i,rightIcon:n,...o},l)=>(0,r.jsxs)("div",{className:"w-full",children:[e&&r.jsx("label",{className:"block text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1",children:e}),(0,r.jsxs)("div",{className:"relative group",children:[i&&r.jsx("div",{className:"absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-white transition-colors",children:i}),r.jsx("input",{ref:l,className:`
              block w-full rounded-xl bg-white/[0.03] border text-white placeholder-zinc-700 
              focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.05] transition-all duration-300
              ${i?"pl-12":"pl-4"}
              ${n?"pr-12":"pr-4"}
              ${t?"border-red-500/50 focus:ring-red-500/20":"border-white/[0.08] hover:border-white/[0.15]"}
              py-3 text-[14px] font-medium
              ${a}
            `,...o}),n&&r.jsx("div",{className:"absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-600",children:n})]}),t&&r.jsx("p",{className:"mt-2 ml-1 text-[11px] text-red-500 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1",children:t}),s&&!t&&r.jsx("p",{className:"mt-2 ml-1 text-[11px] text-zinc-600 font-medium",children:s})]}));a.displayName="Input";let i=a},4684:(e,t,s)=>{"use strict";s.d(t,{Z:()=>o});var r=s(73227),a=s(23677),i=s(65327);let n=(0,a.forwardRef)(({label:e,error:t,helper:s,className:a="",options:n,...o},l)=>(0,r.jsxs)("div",{className:"w-full",children:[e&&r.jsx("label",{className:"block text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1",children:e}),(0,r.jsxs)("div",{className:"relative group",children:[r.jsx("select",{ref:l,className:`
              block w-full rounded-xl bg-white/[0.03] border text-white appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.05] transition-all duration-300
              ${t?"border-red-500/50 focus:ring-red-500/20":"border-white/[0.08] hover:border-white/[0.15]"}
              pl-4 pr-10 py-3 text-[14px] font-medium
              ${a}
            `,...o,children:n.map(e=>r.jsx("option",{value:e.value,className:"bg-zinc-900 text-white",children:e.label},e.value))}),r.jsx("div",{className:"absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-zinc-600 group-hover:text-zinc-400 transition-colors",children:r.jsx(i.Z,{size:16})})]}),t&&r.jsx("p",{className:"mt-2 ml-1 text-[11px] text-red-500 font-bold uppercase tracking-widest",children:t}),s&&!t&&r.jsx("p",{className:"mt-2 ml-1 text-[11px] text-zinc-600 font-medium",children:s})]}));n.displayName="Select";let o=n},57173:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});var r=s(73227);function a({checked:e,onChange:t,label:s,description:a,disabled:i}){return(0,r.jsxs)("div",{className:`flex items-start justify-between gap-4 ${i?"opacity-50 pointer-events-none":""}`,children:[(s||a)&&(0,r.jsxs)("div",{className:"flex flex-col",children:[s&&r.jsx("span",{className:"text-[11px] font-black uppercase tracking-[0.2em] text-white/80",children:s}),a&&r.jsx("span",{className:"text-[11px] text-zinc-600 font-medium",children:a})]}),r.jsx("button",{role:"switch","aria-checked":e,onClick:()=>t(!e),className:`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-300 ease-in-out focus:outline-none ring-offset-black
          ${e?"bg-white":"bg-white/[0.08]"}
        `,children:r.jsx("span",{className:`
            pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-xl 
            transition duration-300 ease-in-out ring-0
            ${e?"translate-x-5 bg-black":"translate-x-0 bg-zinc-500"}
          `})})]})}},56942:(e,t,s)=>{"use strict";s.d(t,{Z:()=>r});let r=(0,s(10943).Z)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},65327:(e,t,s)=>{"use strict";s.d(t,{Z:()=>r});let r=(0,s(10943).Z)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},90931:(e,t,s)=>{"use strict";s.d(t,{Z:()=>r});let r=(0,s(10943).Z)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},84576:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l,metadata:()=>n});var r=s(99013),a=s(40223),i=s(36632);let n={title:"Nginx Config Generator — WokTool",description:"Generate complete nginx server block configuration for your use case."},o=(0,a.default)(()=>s.e(1827).then(s.bind(s,21827)),{loadableGenerated:{modules:["app/tools/nginx-config/page.tsx -> ./_client"]},ssr:!1});function l(){return r.jsx(i.Z,{id:"nginx-config",label:"Nginx Config Generator",description:"Generate complete nginx.conf server blocks for static sites, reverse proxies, PHP, and Node.js.",icon:"⚙️",children:r.jsx(o,{})})}}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[4522,4436,604,9933],()=>s(68624));module.exports=r})();