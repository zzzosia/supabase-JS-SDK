import{s as d}from"./api-client-UALAF0dw.js";const m=document.getElementById("login-redirect"),c=document.getElementById("logout-button"),b=document.getElementById("add-article-button"),l=document.getElementById("add-modal"),u=document.getElementById("edit-modal"),i=document.getElementById("add-form"),n=document.getElementById("edit-form");d.auth.getSession().then(({data:{session:a}})=>{a?(m.classList.add("hidden"),c.classList.remove("hidden")):(m.classList.remove("hidden"),c.classList.add("hidden"))});c.addEventListener("click",async()=>{await d.auth.signOut(),location.reload()});async function r(){const[{data:a},{data:{session:t}}]=await Promise.all([d.from("article").select("*").order("created_at",{ascending:!1}),d.auth.getSession()]),e=document.querySelector(".articles");e&&(e.innerHTML=a.map(o=>`
    <article class="article py-6 bg-white/50 p-6 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-3 gap-y-2" data-id="${o.id}">
      <div class="col-start-2 row-start-1">
        <h2 class="text-xl font-semibold">${o.title}</h2>
        <h3 class="mt-2">${o.subtitle||""}</h3>
        <div class="text-sm text-primary/70 mt-2">
          <address class="not-italic mt-1.5" rel="author">${o.author}</address>
          <time datetime="${o.created_at}">${new Date(o.created_at).toLocaleDateString()}</time>
          <p class="mb-4 mt-1.5 whitespace-pre-wrap">${o.content}</p>
        </div>
      </div>
      <div class="col-start-2 row-start-2 flex space-x-2">
        ${t?`
          <button class="edit-button bg-primary hover:bg-hovering px-3 py-1 rounded text-white cursor-pointer">edytuj</button>
          <button class="delete-button bg-secondary text-white px-3 py-1 rounded hover:bg-hoveringS cursor-pointer">usuń</button>
        `:""}
      </div>
    </article>
  `).join(""),f())}function f(){document.querySelectorAll(".edit-button").forEach(a=>{a.addEventListener("click",t=>{const e=t.target.closest(".article"),o=Number(e.dataset.id),s=e.querySelector("h2").textContent,g=e.querySelector("h3").textContent,h=e.querySelector("p").textContent,y=e.querySelector("address").textContent;n["edit-id"].value=o,n["edit-title"].value=s,n["edit-subtitle"].value=g,n["edit-content"].value=h,n["edit-author"].value=y,u.showModal()})}),document.querySelectorAll(".delete-button").forEach(a=>{a.addEventListener("click",async t=>{const e=t.target.closest(".article"),o=Number(e.dataset.id);if(confirm("Czy na pewno chcesz usunąć ten artykuł?")){const{error:s}=await d.from("article").delete().eq("id",o);s&&console.error(s),await r()}})})}b.addEventListener("click",()=>l.showModal());document.getElementById("cancel-add").addEventListener("click",()=>l.close());i.addEventListener("submit",async a=>{a.preventDefault();const t=new FormData(i),{error:e}=await d.from("article").insert({title:t.get("add-title"),subtitle:t.get("add-subtitle"),content:t.get("add-content"),author:t.get("add-author")});e&&console.error(e),l.close(),i.reset(),await r()});n.addEventListener("submit",async a=>{a.preventDefault();const t=new FormData(n),e=Number(t.get("edit-id")),{error:o}=await d.from("article").update({title:t.get("edit-title"),subtitle:t.get("edit-subtitle"),content:t.get("edit-content"),author:t.get("edit-author")}).eq("id",e);o&&console.error(o),u.close(),n.reset(),await r()});document.getElementById("cancel-edit").addEventListener("click",()=>u.close());r();
