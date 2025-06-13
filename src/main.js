import { supabase } from './api-client.js';

let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return console.error('Supabase error:', error);

  currentUser = session ? session.user : null;

  setupNav();

  await fetchArticles();

  const addBtn = document.getElementById('add-article-button');
  if (addBtn) {
    if (currentUser) {
      addBtn.style.display = '';
      setupAddBtn();
      setupModal();
    } else {
      addBtn.style.display = 'none';
    }
  }

  if (currentUser) {
    setupLogoutBtn();
  }
});

function setupNav(){
  const nav = document.getElementById('nav-list');
  if (!nav) return;
  if (currentUser) {
    nav.innerHTML = `
      <li><a href="index.html" class="text-white hover:underline">Home</a></li>
      <li class="font-medium px-4 text-white">${currentUser.email}</li>
      <li><button id="logout-btn" class="text-red-500 hover:underline transition">Wyloguj</button></li>`;
  } else {
    nav.innerHTML = `
      <li><a href="index.html" class="hover:underline">Home</a></li>
      <li><a href="login/index.html" class="text-blue-500 hover:underline transition">Zaloguj</a></li>`;
  }
}

function setupLogoutBtn(){
  document.getElementById('logout-button')
    .addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.reload();
  });
}

async function fetchArticles(){
  const { data, error } = await supabase
    .from('article')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return console.error(error);

  const container = document.querySelector('.articles');
  container.innerHTML = data.map(renderArticle).join('');
  document.querySelectorAll('.edit-button').forEach(btn => btn.onclick = openEditModal);
  document.querySelectorAll('.delete-button').forEach(btn => btn.onclick = deleteArticle);
}

function renderArticle(article) {
  const date = article.created_at ? new Date(article.created_at).toLocaleDateString() : '';
  return `
    <article class="article py-6 bg-white/50 p-6 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-3 gap-y-2" data-id="${article.id}">
      <div class="col-start-2 row-start-1">
        <h2 class="text-xl font-semibold">${article.title}</h2>
        <h3 class="mt-2">${article.subtitle || ''}</h3>
        <div class="text-sm text-primary/70 mt-2">
          <address class="not-italic mt-1.5" rel="author">${article.author}</address>
          <time datetime="${article.created_at}">${new Date(article.created_at).toLocaleDateString()}</time>
          <p class="mb-4 mt-1.5 whitespace-pre-wrap">${article.content}</p>
        </div>
      </div>
      <div class="col-start-2 row-start-2 flex space-x-2">
        ${currentUser ? `<button class="edit-button" data-id="${article.id}" ...>edytuj</button>
        <button class="delete-button" data-id="${article.id}" ...>usuń</button>` : ''}
      </div>
    </article>`;
}

function setupAddBtn(){
  document.getElementById('add-article-button').onclick = () => openModal();
}

function setupModal(){
  const modal = document.getElementById('article-modal');
  document.getElementById('cancel-button').onclick = () => modal.close();
  document.getElementById('article-form').onsubmit = handleFormSubmit;
}

async function openModal(article = null){
  const modal = document.getElementById('article-modal');
  document.getElementById('modal-title').textContent = article ? 'Edytuj artykuł' : 'Dodaj artykuł';
  document.getElementById('article-id').value = article?.id || '';
  document.getElementById('title').value = article?.title || '';
  document.getElementById('subtitle').value = article?.subtitle || '';
  document.getElementById('content').value = article?.content || '';
  document.getElementById('author').value = article?.author || '';
    modal.showModal();
}

async function openEditModal(e){
  const { data: article } = await supabase
    .from('article')
    .select('*')
    .eq('id', e.target.dataset.id)
    .single();
  openModal(article);
}

async function deleteArticle(e){
  await supabase.from('article').delete().eq('id', e.target.dataset.id);
  await fetchArticles();
}

async function handleFormSubmit(e){
  e.preventDefault();
  const id = document.getElementById('article-id').value;
  const title = e.target.title.value;
  const content = e.target.content.value;
  const author = e.target.author.value;
  const subtitle = e.target.subtitle ? e.target.subtitle.value : null;
    let tags = e.target.tags ? e.target.tags.value : '["default"]';
  try {
    tags = JSON.parse(tags);
  } catch {
    tags = ["default"];
  }

  const payload = {
    title,
    content,
    author,
    subtitle,
    tags,
    created_at: new Date().toISOString()
  };

  let result;
  if (id) {
    result = await supabase.from('article').update(payload).eq('id', id);
  } else {
    result = await supabase.from('article').insert(payload);
  }

  if (result.error) {
    alert('Błąd: ' + result.error.message);
    return;
  }

  document.getElementById('article-modal').close();
  await fetchArticles();
}
