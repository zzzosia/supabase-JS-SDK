import { supabase } from './supabase.js';

const loginRedirect = document.getElementById('login-redirect');
const logoutButton = document.getElementById('logout-button');
const addButton = document.getElementById('add-article-button');
const addModal = document.getElementById('add-modal');
const editModal = document.getElementById('edit-modal');

const addForm = document.getElementById('add-form');
const editForm = document.getElementById('edit-form');

// AUTH
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    loginRedirect.classList.add('hidden');
    logoutButton.classList.remove('hidden');
  } else {
    loginRedirect.classList.remove('hidden');
    logoutButton.classList.add('hidden');
  }
});

logoutButton.addEventListener('click', async () => {
  await supabase.auth.signOut();
  location.reload();
});

// FETCH AND RENDER
async function fetchArticles() {
  const [{ data: articles }, { data: { session } }] = await Promise.all([
    supabase.from('article').select('*').order('created_at', { ascending: false }),
    supabase.auth.getSession()
  ]);

  const container = document.querySelector('.articles');
  if (!container) return;

  container.innerHTML = articles.map(article => `
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
        ${session ? `
          <button class="edit-button bg-primary hover:bg-hovering px-3 py-1 rounded text-white cursor-pointer">edytuj</button>
          <button class="delete-button bg-secondary text-white px-3 py-1 rounded hover:bg-hoveringS cursor-pointer">usuń</button>
        ` : ''}
      </div>
    </article>
  `).join('');

  setupEditAndDeleteButtons();
}

// SETUP DYNAMIC BUTTON EVENTS
function setupEditAndDeleteButtons() {
  document.querySelectorAll('.edit-button').forEach(btn => {
    btn.addEventListener('click', e => {
      const article = e.target.closest('.article');
      const id = Number(article.dataset.id);
      const title = article.querySelector('h2').textContent;
      const subtitle = article.querySelector('h3').textContent;
      const content = article.querySelector('p').textContent;
      const author = article.querySelector('address').textContent;

      editForm['edit-id'].value = id;
      editForm['edit-title'].value = title;
      editForm['edit-subtitle'].value = subtitle;
      editForm['edit-content'].value = content;
      editForm['edit-author'].value = author;

      editModal.showModal();
    });
  });

  document.querySelectorAll('.delete-button').forEach(btn => {
    btn.addEventListener('click', async e => {
      const article = e.target.closest('.article');
      const id = Number(article.dataset.id);
      if (confirm('Czy na pewno chcesz usunąć ten artykuł?')) {
        const { error } = await supabase.from('article').delete().eq('id', id);
        if (error) console.error(error);
        await fetchArticles();
      }
    });
  });
}

// ADD ARTICLE
addButton.addEventListener('click', () => addModal.showModal());
document.getElementById('cancel-add').addEventListener('click', () => addModal.close());

addForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(addForm);
  const { error } = await supabase.from('article').insert({
    title: formData.get('add-title'),
    subtitle: formData.get('add-subtitle'),
    content: formData.get('add-content'),
    author: formData.get('add-author')
  });
  if (error) console.error(error);
  addModal.close();
  addForm.reset();
  await fetchArticles();
});

// EDIT ARTICLE
editForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(editForm);
  const id = Number(formData.get('edit-id'));
  const { error } = await supabase.from('article').update({
    title: formData.get('edit-title'),
    subtitle: formData.get('edit-subtitle'),
    content: formData.get('edit-content'),
    author: formData.get('edit-author')
  }).eq('id', id);
  if (error) console.error(error);
  editModal.close();
  editForm.reset();
  await fetchArticles();
});

document.getElementById('cancel-edit').addEventListener('click', () => editModal.close());

// START
fetchArticles();
