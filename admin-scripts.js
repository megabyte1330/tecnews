document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:3000';
    let usertype = localStorage.getItem('usertype') || ""; // Recupera o usertype do localStorage
    if (usertype === 'admin') {
        console.log('usuário admin')}
    // Função para carregar as notícias existentes
    function loadNews() {
        fetch(`${apiUrl}/news`)
            .then(response => response.json())
            .then(data => {
                const newsList = document.getElementById('news-list');
                newsList.innerHTML = '';
                data.forEach(news => {
                    const newsItem = document.createElement('div');
                    newsItem.className = 'news-item';
                    newsItem.innerHTML = `
                        <h3>${news.title}</h3>
                        <p>${news.summary}</p>
                        <button onclick="editNews('${news.id}')">Editar</button>
                        <button onclick="deleteNews('${news.id}')">Excluir</button>
                    `;
                    newsList.appendChild(newsItem);
                });
            })
            .catch(error => console.error('Erro ao carregar notícias:', error));
    }

    // Função para editar uma notícia
    window.editNews = function(id) {
        fetch(`${apiUrl}/news/${id}`)
            .then(response => response.json())
            .then(news => {
                document.getElementById('news-id').value = news.id;
                document.getElementById('news-title').value = news.title;
                document.getElementById('news-summary').value = news.summary;
                document.getElementById('news-content').value = news.content;
                document.getElementById('news-image').value = news.image;
            })
            .catch(error => console.error('Erro ao carregar notícia:', error));
    }

    // Função para excluir uma notícia
    window.deleteNews = function(id) {
        fetch(`${apiUrl}/news/${id}`, { method: 'DELETE' })
            .then(() => {
                loadNews();
            })
            .catch(error => console.error('Erro ao excluir notícia:', error));
    }

    // Função para salvar uma notícia (nova ou editada)
    document.getElementById('news-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const id = document.getElementById('news-id').value;
        const title = document.getElementById('news-title').value;
        const summary = document.getElementById('news-summary').value;
        const content = document.getElementById('news-content').value;
        const image = document.getElementById('news-image').value;

        const newsData = { title, summary, content, image };

        if (id) {
            fetch(`${apiUrl}/news/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsData)
            })
                .then(() => {
                    loadNews();
                    document.getElementById('news-form').reset();
                })
                .catch(error => console.error('Erro ao atualizar notícia:', error));
        } else {
            fetch(`${apiUrl}/news`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsData)
            })
                .then(() => {
                    loadNews();
                    document.getElementById('news-form').reset();
                })
                .catch(error => console.error('Erro ao adicionar notícia:', error));
        }
        
    });
    

    // Carregar as notícias ao iniciar a página
    loadNews();
});
