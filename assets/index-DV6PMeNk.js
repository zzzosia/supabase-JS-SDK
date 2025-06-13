import{s as a}from"./api-client-BIRhX0D6.js";let o=null;document.addEventListener("DOMContentLoaded",async()=>{const{data:{session:t},error:e}=await a.auth.getSession();if(e)return console.error("Supabase error:",e);o=t?t.user:null,g(),await i();const n=document.getElementById("add-article-button");n&&(o?(n.style.display="",h(),b()):n.style.display="none"),o&&f()});function g(){const t=document.getElementById("nav-list");t&&(o?t.innerHTML=`
      <li><a href="index.html" class="text-white hover:underline">Home</a></li>
      <li class="font-medium px-4 text-white">${o.email}</li>
      <li><button id="logout-btn" class="text-red-500 hover:underline transition">Wyloguj</button></li>`:t.innerHTML=`
      <li><a href="index.html" class="hover:underline">Home</a></li>
      <li><a href="login/index.html" class="text-blue-500 hover:underline transition">Zaloguj</a></li>`)}function f(){document.getElementById("logout-button").addEventListener("click",async()=>{await a.auth.signOut(),window.location.reload()})}async function i(){const{data:t,error:e}=await a.from("article").select("*").order("created_at",{ascending:!1});if(e)return console.error(e);const n=document.querySelector(".articles");n.innerHTML=t.map(y).join(""),document.querySelectorAll(".edit-button").forEach(d=>d.onclick=p),document.querySelectorAll(".delete-button").forEach(d=>d.onclick=v)}function y(t){return t.created_at&&new Date(t.created_at).toLocaleDateString(),`
    <article class="article py-6 bg-white/50 p-6 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-3 gap-y-2" data-id="${t.id}">
      <div class="col-start-2 row-start-1">
        <h2 class="text-xl font-semibold">${t.title}</h2>
        <h3 class="mt-2">${t.subtitle||""}</h3>
        <div class="text-sm text-primary/70 mt-2">
          <address class="not-italic mt-1.5" rel="author">${t.author}</address>
          <time datetime="${t.created_at}">${new Date(t.created_at).toLocaleDateString()}</time>
          <p class="mb-4 mt-1.5 whitespace-pre-wrap">${t.content}</p>
        </div>
      </div>
      <div class="col-start-2 row-start-2 flex space-x-2">
        ${o?`<button class="edit-button" data-id="${t.id}" ...>edytuj</button>
        <button class="delete-button" data-id="${t.id}" ...>usuń</button>`:""}
      </div>
    </article>`}function h(){document.getElementById("add-article-button").onclick=()=>r()}function b(){const t=document.getElementById("article-modal");document.getElementById("cancel-button").onclick=()=>t.close(),document.getElementById("article-form").onsubmit=w}async function r(t=null){const e=document.getElementById("article-modal");document.getElementById("modal-title").textContent=t?"Edytuj artykuł":"Dodaj artykuł",document.getElementById("article-id").value=(t==null?void 0:t.id)||"",document.getElementById("title").value=(t==null?void 0:t.title)||"",document.getElementById("subtitle").value=(t==null?void 0:t.subtitle)||"",document.getElementById("content").value=(t==null?void 0:t.content)||"",document.getElementById("author").value=(t==null?void 0:t.author)||"",e.showModal()}async function p(t){const{data:e}=await a.from("article").select("*").eq("id",t.target.dataset.id).single();r(e)}async function v(t){await a.from("article").delete().eq("id",t.target.dataset.id),await i()}async function w(t){t.preventDefault();const e=document.getElementById("article-id").value,n=t.target.title.value,d=t.target.content.value,c=t.target.author.value,m=t.target.subtitle?t.target.subtitle.value:null;let l=t.target.tags?t.target.tags.value:'["default"]';try{l=JSON.parse(l)}catch{l=["default"]}const u={title:n,content:d,author:c,subtitle:m,tags:l,created_at:new Date().toISOString()};let s;if(e?s=await a.from("article").update(u).eq("id",e):s=await a.from("article").insert(u),s.error){alert("Błąd: "+s.error.message);return}document.getElementById("article-modal").close(),await i()}
