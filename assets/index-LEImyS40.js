import{s as o}from"./api-client-DzGiXqN3.js";let a=null;document.addEventListener("DOMContentLoaded",async()=>{const{data:{session:t},error:e}=await o.auth.getSession();if(e)return console.error("Supabase error:",e);a=t?t.user:null,g(),await d();const n=document.getElementById("add-article-button");n&&(a?(n.style.display="",f(),h()):n.style.display="none"),a&&y()});function g(){const t=document.getElementById("nav-list");t&&(a?t.innerHTML=`
      <li><a href="index.html" class="bg-primary text-white hover:bg-hovering">strona główna</a></li>
      <li class="font-medium px-4 text-white">${a.email}</li>
      <li><button id="logout-button" class="bg-primary text-white hover:bg-hovering">wyloguj</button></li>`:t.innerHTML=`
      <li><a href="index.html" class="bg-primary text-white hover:bg-hovering">strona główna</a></li>
      <li><a href="login/index.html" class="bg-primary text-white hover:bg-hovering">zaloguj</a></li>`)}function y(){document.getElementById("logout-button").addEventListener("click",async()=>{await o.auth.signOut(),window.location.reload()})}async function d(){const{data:t,error:e}=await o.from("article").select("*").order("created_at",{ascending:!1});if(e)return console.error(e);const n=document.querySelector(".articles");n.innerHTML=t.map(p).join(""),document.querySelectorAll(".edit-button").forEach(l=>l.onclick=b),document.querySelectorAll(".delete-button").forEach(l=>l.onclick=v)}function p(t){const e=t.created_at?new Date(t.created_at).toLocaleDateString():"";return`
    <article class="rticle py-6 bg-white/50 p-6 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-3 gap-y-2">
      <header>
        <p class="text-xl font-semibold">${t.title}</p>
        <p class="tmt-2">${t.subtitle||""}</p>
        <p class="not-italic mt-1.5">autor: ${t.author||""}</p>
        <p class="not-italic mt-1.5">data: ${e}</p>
      </header>
      <p>${t.content}</p>
      ${a?`
        <footer class="mt-3 flex gap-2">
          <button data-id="${t.id}" class="edit-button bg-primary hover:bg-hovering px-3 py-1 rounded text-white cursor-pointer">edytuj</button>
          <button data-id="${t.id}" class="delete-button bg-secondary text-white px-3 py-1 rounded hover:bg-hoveringS cursor-pointer">usuń</button>
        </footer>`:""}
    </article>`}function f(){document.getElementById("add-article-button").onclick=()=>s()}function h(){const t=document.getElementById("article-modal");document.getElementById("cancel-button").onclick=()=>t.close(),document.getElementById("article-form").onsubmit=w}async function s(t=null){const e=document.getElementById("article-modal");document.getElementById("modal-title").textContent=t?"Edytuj artykuł":"Dodaj artykuł",document.getElementById("article-id").value=(t==null?void 0:t.id)||"",document.getElementById("title").value=(t==null?void 0:t.title)||"",document.getElementById("subtitle").value=(t==null?void 0:t.subtitle)||"",document.getElementById("content").value=(t==null?void 0:t.content)||"",document.getElementById("author").value=(t==null?void 0:t.author)||"",e.showModal()}async function b(t){const{data:e}=await o.from("article").select("*").eq("id",t.target.dataset.id).single();s(e)}async function v(t){await o.from("article").delete().eq("id",t.target.dataset.id),await d()}async function w(t){t.preventDefault();const e=document.getElementById("article-id").value,n=t.target.title.value,l=t.target.content.value,c=t.target.author.value,m=t.target.subtitle?t.target.subtitle.value:null;let r=t.target.tags?t.target.tags.value:'["default"]';try{r=JSON.parse(r)}catch{r=["default"]}const u={title:n,content:l,author:c,subtitle:m,tags:r,created_at:new Date().toISOString()};let i;if(e?i=await o.from("article").update(u).eq("id",e):i=await o.from("article").insert(u),i.error){alert("error: "+i.error.message);return}document.getElementById("article-modal").close(),await d()}
