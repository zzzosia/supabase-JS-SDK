import { supabase } from './api-client.js';

let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return console.error('Supabase error:', error);
  currentUser = session ? session.user : null;
  setupNav();
  await fetchArticles();
  const addButton = document.getElementById('add-article-button');
  if (addButton) {
    if (currentUser) {
      addButton.style.display = '';
      setupaddButton();
      setupModal();
    } else {
      addButton.style.display = 'none';
    }
  }
  if (currentUser) {
    setupLogoutbutton();
  }
});

function setupNav(){
  const nav = document.getElementById('nav-list');
  if (!nav) return;
  if (currentUser) {
    nav.innerHTML = `
      <li><a href="index.html" class="bg-primary text-white hover:bg-hovering">strona główna</a></li>
      <li class="font-medium px-4 text-white">${currentUser.email}</li>
      <li><button id="logout-button" class="bg-primary text-white hover:bg-hovering">wyloguj</button></li>`;
  } else {
    nav.innerHTML = `
      <li><a href="index.html" class="bg-primary text-white hover:bg-hovering">strona główna</a></li>
      <li><a href="login/index.html" class="bg-primary text-white hover:bg-hovering">zaloguj</a></li>`;
  }
}

function setupLogoutbutton(){
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
  document.querySelectorAll('.edit-button').forEach(button => button.onclick = openEditModal);
  document.querySelectorAll('.delete-button').forEach(button => button.onclick = deleteArticle);
}

function renderArticle(art) {
  const date = art.created_at ? new Date(art.created_at).toLocaleDateString() : '';
  return `
    <article class="rticle py-6 bg-white/50 p-6 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-3 gap-y-2">
      <header>
        <p class="text-xl font-semibold">${art.title}</p>
        <p class="tmt-2">${art.subtitle || ''}</p>
        <p class="not-italic mt-1.5">autor: ${art.author || ''}</p>
        <p class="not-italic mt-1.5">data: ${date}</p>
      </header>
      <p>${art.content}</p>
      ${currentUser ? `
        <footer class="mt-3 flex gap-2">
          <button data-id="${art.id}" class="edit-button bg-primary hover:bg-hovering px-3 py-1 rounded text-white cursor-pointer">edytuj</button>
          <button data-id="${art.id}" class="delete-button bg-secondary text-white px-3 py-1 rounded hover:bg-hoveringS cursor-pointer">usuń</button>
        </footer>` : ''}
    </article>`;
}

function setupaddButton(){
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
    alert('error: ' + result.error.message);
    return;
  }
  document.getElementById('article-modal').close();
  await fetchArticles();
}
