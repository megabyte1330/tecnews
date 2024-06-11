document.addEventListener('DOMContentLoaded', function() {
    console.log("Documento carregado");

    const apiUrl = 'http://localhost:3000';

    // Função para carregar os detalhes da notícia
    function loadNewsDetail(newsData) {
        const params = new URLSearchParams(window.location.search);
        const newsId = params.get('id');
        
        if (newsId) {
            const news = newsData.find(item => item.id == newsId);
            if (news) {
                document.getElementById('news-title').innerText = news.title;
                document.getElementById('news-content').innerText = news.content;
            } else {
                document.getElementById('news-detail').innerHTML = '<p>Notícia não encontrada.</p>';
            }
        }
    }

    // Função para carregar a lista de notícias em grupos de tamanhos variados
    function loadNewsList(newsData) {
        const newsContainer = document.getElementById('news-container');
        const groupSizes = [1, 2, 3, 2]; // Exemplo de distribuição dos tamanhos dos grupos
    
        let newsIndex = 0;
        let groupIndex = 0;
    
        while (newsIndex < newsData.length) {
            const size = groupSizes[groupIndex % groupSizes.length];
    
            const group = document.createElement('div');
            group.className = 'news-group';
            newsContainer.appendChild(group);
    
            for (let i = 0; i < size; i++) {
                if (newsIndex >= newsData.length) break; // Verifica se ainda há notícias
    
                const news = newsData[newsIndex];
                const article = document.createElement('article');
                article.className = 'news-item';
                article.innerHTML = `
                    <img src="${news.image}" alt="Imagem da Notícia">
                    <div>
                        <h2>${news.title}</h2>
                        <p>${news.summary}</p>
                    </div>
                `;
                article.addEventListener('click', () => {
                    window.location.href = `news.html?id=${news.id}`;
                });
                group.appendChild(article);
                newsIndex++;
            }
    
            groupIndex++;
        }
    }

    // Função para carregar as notícias do servidor
    function fetchNewsData(callback) {
        fetch(`${apiUrl}/news`)
            .then(response => response.json())
            .then(data => {
                // Ordena os dados pelo ID
                data.sort((a, b) => a.id - b.id);
                callback(data);
            })
            .catch(error => console.error('Erro ao carregar notícias:', error));
    }

    // Função de busca de notícias
    function searchNews(newsData) {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        // Inicialmente esconde o dropdown
        searchResults.classList.add('hidden');

        searchInput.addEventListener('input', function() {
            const query = searchInput.value.toLowerCase();
            searchResults.innerHTML = '';
            if (query) {
                const filteredNews = newsData.filter(item => item.title.toLowerCase().includes(query));
                if (filteredNews.length > 0) {
                    searchResults.classList.remove('hidden');
                    filteredNews.forEach(news => {
                        const resultItem = document.createElement('a');
                        resultItem.href = `news.html?id=${news.id}`;
                        resultItem.textContent = news.title;
                        searchResults.appendChild(resultItem);
                    });
                } else {
                    searchResults.classList.add('hidden');
                }
            } else {
                searchResults.classList.add('hidden');
            }
        });

        searchInput.addEventListener('focus', function() {
            if (searchResults.children.length > 0) {
                searchResults.classList.remove('hidden');
            }
        });

        searchInput.addEventListener('blur', function() {
            setTimeout(() => { searchResults.classList.add('hidden'); }, 200);
        });
    }

    // Verifica se está na página de detalhes da notícia
    if (window.location.pathname.endsWith('news.html')) {
        fetchNewsData(loadNewsDetail);
    } else {
        fetchNewsData(data => {
            loadNewsList(data);
            searchNews(data);
        });
    }

    // Seleciona o elemento sidebar
    const sidebar = document.getElementById("sidebar");

    // Seleciona o ícone do menu
    const menuIcon = document.querySelector("header figure");
     menuIcon.addEventListener('click', function() {
            sidebar.classList.toggle('visible');
        });
      // Função de login
      function login(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login bem-sucedido!');
                // Redirecionar ou atualizar a interface do usuário conforme necessário
            } else {
                document.getElementById('login-error').style.display = 'block';
            }
        })
        .catch(error => console.error('Erro ao fazer login:', error));
    }

    // Adicionar evento ao formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    const lgn = document.getElementById('login-section')
    const botaoteste = document.getElementById('botaoteste')
    botaoteste.addEventListener('click', function(){
        lgn.classList.toggle('active');
    });

    
});
