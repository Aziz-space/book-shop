window.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadBooks();
    loadCategoriesForFilters();
    loadTagsForFilters();
    loadAuthorsForFilters();



    document.getElementById('search-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = document.getElementById('search-query').value.trim();
        if (query) {
            await loadBooks(null, null, query); 
        }
    });

    const burgerMenu = document.getElementById('burger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileCategoryLinks = document.getElementById('mobile-category-links');

    burgerMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active'); 

        if (mobileMenu.classList.contains('active')) {
            mobileCategoryLinks.innerHTML = '';

            const categoryLinks = document.getElementById('category-links').children;
            for (let link of categoryLinks) {
                const li = document.createElement('li');
                li.innerHTML = link.innerHTML; 
                mobileCategoryLinks.appendChild(li); 
            }
        }
    });
    document.getElementById('category-links').addEventListener('click', async (event) => {
        const target = event.target;
        if (target.tagName === 'A' && target.dataset.categoryName) {
            event.preventDefault();
            const categoryName = target.dataset.categoryName;
            await loadBooks(categoryName); 
        }
    });

    document.addEventListener('click', async (event) => {
        const target = event.target;
        if (target.classList.contains('tag-link')) {
            event.preventDefault();
            const tagName = target.dataset.tagName;
            await loadBooks(null, tagName);
            document.getElementById('book-detail-container').style.display = 'none';
            document.querySelector('.main-container').style.display = 'flex';
        }
    });

    
    document.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('button') && target.dataset.bookId) {
            event.preventDefault();
            const bookId = target.dataset.bookId;
            loadBookDetail(bookId); 
            document.getElementById('book-detail-container').style.display = 'block';
            document.querySelector('.main-container').style.display = 'none';
            document.querySelector('.title-container').style.display = 'none';
            document.querySelector('.pagination-container').style.display = 'none';
        }
    });

   

    document.getElementById('pagination-container').addEventListener('click', async (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            const page = target.dataset.page; 
            if (page && !isNaN(page)) { 
                await loadBooks(null, null, '', Number(page)); 
            }
        }
    });
});




async function loadCategories() {
    try {
        const response = await fetch('http://127.0.0.1:1800/api/categories/');
        const categories = await response.json();
        const categoryLinks = document.getElementById('category-links');
        categoryLinks.innerHTML = ''; 

        if (categories.length === 0) {
            categoryLinks.innerHTML = '<p>Категории отсутствуют.</p>';
            return;
        }

        categories.forEach(category => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#'; 
            a.textContent = category.name;
            a.dataset.categoryName = category.name; 
            li.appendChild(a);
            categoryLinks.appendChild(li);
        });
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
}



async function loadCategoriesForFilters() {
    try {
        const response = await fetch('http://127.0.0.1:1800/api/categories/');
        const categories = await response.json();
        const categoryCheckboxes = document.getElementById('category-checkboxes');
        categoryCheckboxes.innerHTML = '';

        if (categories.length === 0) {
            categoryCheckboxes.innerHTML = '<p>Категории отсутствуют.</p>';
            return;
        }

        categories.forEach(category => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category.name;
            checkbox.classList.add('category-checkbox'); 
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(category.name));
            categoryCheckboxes.appendChild(label);
        });
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
}



async function loadTagsForFilters() {
    try {
        const response = await fetch('http://127.0.0.1:1800/api/tags/');
        const tags = await response.json();
        const tagCheckboxes = document.getElementById('tag-checkboxes');
        tagCheckboxes.innerHTML = '';

        if (tags.length === 0) {
            tagCheckboxes.innerHTML = '<p>Теги отсутствуют.</p>';
            return;
        }

        tags.forEach(tag => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = tag.name; 
            checkbox.classList.add('tag-checkbox');
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(tag.name));
            tagCheckboxes.appendChild(label);
        });
    } catch (error) {
        console.error('Ошибка загрузки тегов:', error);
    }
}



async function loadAuthorsForFilters() {
    try {
        const response = await fetch('http://127.0.0.1:1800/api/authors/');
        const authors = await response.json();
        const authorCheckboxes = document.getElementById('author-checkboxes');
        authorCheckboxes.innerHTML = ''; 

        if (authors.length === 0) {
            authorCheckboxes.innerHTML = '<p>Авторы отсутствуют.</p>';
            return;
        }

        authors.forEach(author => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = author.name; 
            checkbox.classList.add('author-checkbox'); 
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(author.name));
            authorCheckboxes.appendChild(label);
        });
    } catch (error) {
        console.error('Ошибка загрузки авторов:', error);
    }
}

document.getElementById('filter-button').addEventListener('click', async () => {
    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
    const selectedTags = Array.from(document.querySelectorAll('.tag-checkbox:checked')).map(cb => cb.value);
    const selectedAuthors = Array.from(document.querySelectorAll('.author-checkbox:checked')).map(cb => cb.value);

    await loadBooks(selectedCategories.join(','), selectedTags.join(','), selectedAuthors.join(',')); // Загружаем книги по выбранным фильтрам
});



async function loadBooks(categoryName = null, tagName = null, query = '', page = 1) {
    const pageSize = 7;
    let url = `/api/books/?page=${page}&page_size=${pageSize}`;

    
    const params = new URLSearchParams();
    if (query) {
        params.append('search', query);
    }
    if (categoryName) {
        params.append('category', categoryName);
    }
    if (tagName) {
        params.append('tag', tagName);
    }
    if (params.toString()) {
        url += `&${params.toString()}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Сеть ответила с ошибкой ' + response.status);

        const data = await response.json();
        const booksContainer = document.getElementById('books-container');
        booksContainer.innerHTML = '';

        if (data.results.length === 0) {
            booksContainer.innerHTML = '<p>Книги не найдены.</p>';
            return;
        }



        data.results.forEach(book => {
            const category = book.category ? book.category : 'Без категории';
            const tags = book.tags.length > 0
                ? book.tags.map(tag => `<a href="#" class="tag-link" data-tag-name="${tag.name}">${tag.name}</a>`).join(', ')
                : 'Нет тегов';

            const card = `
                <div class="card">
                    <img src="${book.img}" alt="${book.title}" class="card-image" />
                    <h2 class="card-title">${book.title}</h2>
                    <p class="card-author"><strong>Автор:</strong> ${book.author.name}</p>
                    <p class="card-price"><strong>Цена:</strong> ${book.price} ₽</p>
                    <p class="card-category"><strong>Категория:</strong> ${category}</p>
                    <p class="card-tags"><strong>Теги:</strong> ${tags}</p>
                    <p class="card-published"><strong>Дата публикации:</strong> ${book.published_date}</p>
                    <a href="#" class="button" data-book-id="${book.id}">Детальный просмотр</a>
                </div>
            `;
            booksContainer.insertAdjacentHTML('beforeend', card);
        });


        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = ''; 

        const totalPages = Math.ceil(data.count / pageSize);
        for (let i = 1; i <= totalPages; i++) {
            const buttonClass = i === page ? 'pagination-button active' : 'pagination-button'; 
            paginationContainer.innerHTML += `<button data-page="${i}" class="${buttonClass}">${i}</button>`;
        }

       
        if (data.previous) {
            const urlParams = new URL(data.previous).searchParams;
            const previousPage = urlParams.get('page'); 
            if (previousPage) {
                paginationContainer.insertAdjacentHTML('afterbegin', `<button data-page="${previousPage}" class="arrow-button">←</button>`);
            }
        }
        if (data.next) {
            const urlParams = new URL(data.next).searchParams;
            const nextPage = urlParams.get('page'); 
            if (nextPage) {
                paginationContainer.insertAdjacentHTML('beforeend', `<button data-page="${nextPage}" class="arrow-button">→</button>`);
            }
        }

    } catch (error) {
        console.error('Ошибка при загрузке книг:', error);
    }
}




loadBooks(null, null, '', 1);





async function loadBookDetail(bookId) {
    try {
        console.log('Загрузка книги с ID:', bookId); 
        const response = await fetch(`http://127.0.0.1:1800/api/books/${bookId}/`);
        if (!response.ok) throw new Error('Ошибка загрузки книги: ' + response.status);
        
        const book = await response.json();
        console.log('Данные книги:', book); 
        

        const bookDetailHTML = `
            <div class="book-detail-left">
                <img src="${book.img}" alt="${book.title}" class="book-detail-img">
            </div>
            <div class="book-info">
                <h1>${book.title}</h1>
                <p><strong>Автор:</strong> ${book.author.name}</p>
                <p><strong>Цена:</strong> ${book.price} ₽</p>
                <p><strong>Дата публикации:</strong> ${book.published_date}</p>
                <p><strong>Категория:</strong> ${book.category}</p>
                <p class="card-tags"><strong>Теги:</strong> 
                    ${book.tags.length > 0 
                        ? book.tags.map(tag => `<a href="#" class="tag-link" data-tag-name="${tag.name}">${tag.name}</a>`).join(', ')
                        : 'Нет тегов'}
                </p>
            </div>
            <div class="book-description">
                <p><strong>Описание:</strong> ${book.description}</p>
            </div>
        `;


        const bookDetailContainer = document.getElementById('book-detail-container');
        const bookDetail = document.getElementById('book-detail');
        const bookMain = document.querySelector('.main-container');
        
        if (bookDetailContainer && bookDetail) {
            bookDetail.innerHTML = bookDetailHTML;
            bookDetailContainer.style.display = 'block'; 
            bookMain.style.display = 'none'; 
        }
    } catch (error) {
        console.error('Ошибка загрузки деталей книги:', error);
    }
}









window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен');

    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const logoutButton = document.getElementById('logout-button');
    const profileContainer = document.getElementById('profile');
    const avatarImg = document.getElementById('avatar');

    if (loginButton) {
        loginButton.addEventListener('click', showLoginForm);
    }

    if (registerButton) {
        registerButton.addEventListener('click', showRegisterForm);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    if (avatarImg) {
        avatarImg.addEventListener('click', loadUserProfile);
    }

    const { token } = getTokenAndUserId();
    if (!token) {
        showAuthButtons();
    } else {
        showLogoutButton();
    }

    loadAvatarIfAuthenticated();

    function loadAvatarIfAuthenticated() {
        const { token, userId } = getTokenAndUserId();
        if (!token) return;

        fetch(`http://127.0.0.1:1800/api/auth/profile/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки профиля');
            return response.json();
        })
        .then(data => {
            updateAvatar(data.avatar);
        })
        .catch(error => {
            console.error('Ошибка загрузки профиля:', error);
        });
    }

    function updateAvatar(avatarUrl) {
        const avatarImg = document.getElementById('avatar');
        if (avatarImg) {
            avatarImg.src = avatarUrl || '/static/img/default-avatar.jpg';
        }
    }

    function hideBookElements() {
        const bookMain = document.querySelector('.main-container');
        const bookTitle = document.querySelector('.title-container');
        const paginationContainer = document.getElementById('pagination-container');

        if (bookMain) bookMain.style.display = 'none';
        if (bookTitle) bookTitle.style.display = 'none';
        if (paginationContainer) paginationContainer.style.display = 'none';
    }





    async function showEditProfileForm() {
        const { token, userId } = getTokenAndUserId();
        if (!token) return;
    
        try {
            const response = await fetch(`http://127.0.0.1:1800/api/auth/profile/${userId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) throw new Error('Ошибка загрузки профиля');
    
            const data = await response.json();
    
            profileContainer.innerHTML = `
                <img src="/static/img/close.png" alt="Close" class="close-icon" id="close-form-btn">
                <h2>Изменить профиль</h2>
                <form id="edit-profile-form" enctype="multipart/form-data">
                    <div class="avatar-container">
                        <img src="${data.avatar || '/static/img/default-avatar.jpg'}" alt="Аватар" class="avatar-img" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;" id="avatar-preview">
                        <button type="button" id="change-avatar-btn" class="change-avatar-btn">Изменить</button>
                    </div>
                    <div class="profile-field">
                        <h3 class="profile-label">Имя:</h3>
                        <input type="text" id="edit-first-name" placeholder="Имя" value="${data.first_name || ''}" required />
                    </div>
                    <div class="profile-field">
                        <h3 class="profile-label">Фамилия:</h3>
                        <input type="text" id="edit-last-name" placeholder="Фамилия" value="${data.last_name || ''}" required />
                    </div>
                    <div class="profile-field">
                        <h3 class="profile-label">Email:</h3>
                        <input type="email" id="edit-email" placeholder="Email" value="${data.email || ''}" required />
                    </div>
                    <div class="button-container">
                        <input type="file" id="edit-avatar" accept="image/*" style="display: none;" />
                        <button type="submit" class="save-changes-btn">Сохранить изменения</button>
                    </div>
                </form>
            `;
    
            profileContainer.style.display = 'block';
    
            const closeBtn = document.getElementById('close-form-btn');
            closeBtn.addEventListener('click', () => {
                closeForm(); 
            });
    
            const editProfileForm = document.getElementById('edit-profile-form');
            editProfileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
    
                const firstName = document.getElementById('edit-first-name').value;
                const lastName = document.getElementById('edit-last-name').value;
                const email = document.getElementById('edit-email').value;
                const avatarFile = document.getElementById('edit-avatar').files[0];
    
             
                const formData = new FormData();
                formData.append('first_name', firstName);
                formData.append('last_name', lastName);
                formData.append('email', email);
                if (avatarFile) {
                    formData.append('avatar', avatarFile); 
                }
    
                try {
                    const response = await fetch(`http://127.0.0.1:1800/api/auth/profile/${userId}/`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                        body: formData 
                    });
    
                    if (!response.ok) throw new Error('Ошибка изменения профиля');
    
                    alert('Профиль успешно обновлен.');
                    loadUserProfile(); 
    
                } catch (error) {
                    console.error('Ошибка изменения профиля:', error);
                    alert('Ошибка изменения профиля.');
                }
            });
    
            document.getElementById('change-avatar-btn').addEventListener('click', () => {
                document.getElementById('edit-avatar').click(); 
            });
    
            document.getElementById('edit-avatar').addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById('avatar-preview').src = e.target.result; 
                    };
                    reader.readAsDataURL(file);
                }
            });
    
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            alert('Ошибка загрузки профиля.');
        }
    }
    


    async function loadUserProfile() {
        const { token, userId } = getTokenAndUserId();
        if (!token) return;

        hideBookElements();

        try {
            const response = await fetch(`http://127.0.0.1:1800/api/auth/profile/${userId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        
            if (!response.ok) throw new Error('Ошибка загрузки профиля');
        
            const data = await response.json();
        
            profileContainer.innerHTML = `
            <img src="/static/img/close.png" alt="Close" class="close-icon" id="close-form-btn">
            <h2>Профиль пользователя</h2>
            <img src="${data.avatar || '/static/img/default-avatar.jpg'}" alt="Аватар пользователя" class="avatar-img"> 
            <div class="profile-field">
                <h3 class="profile-label">Email:</h3>
                <p class="profile-value">${data.email}</p>
                <hr class="profile-separator">
            </div>
            <div class="profile-field">
                <h3 class="profile-label">Имя:</h3>
                <p class="profile-value">${data.first_name} ${data.last_name}</p>
                <hr class="profile-separator">
            </div>
            <div class="button-container">
                <button id="my-books-btn" class="my-books-btn">Мои книги</button>
                <button id="edit-profile-btn" class="edit-profile-btn">Изменить профиль</button>
            </div>
        `;
            
        document.getElementById('my-books-btn').addEventListener('click', async () => {
            hideBookElements();
            document.getElementById('my-books-container').style.display = 'block';
            await loadMyBooks(); 
        });
            
            profileContainer.style.display = 'block'; 
            showLogoutButton();

            const closeBtn = document.getElementById('close-form-btn');
            closeBtn.addEventListener('click', () => {
            closeForm(); 
        });
        
            const editProfileBtn = document.getElementById('edit-profile-btn');
            if (editProfileBtn) {
                editProfileBtn.addEventListener('click', () => {
                    showEditProfileForm();
                });
            }
        
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            alert('Ошибка загрузки профиля.');
        }
        
    }


    



    async function loadMyBooks() {
        const { token, userId } = getTokenAndUserId();
        if (!token) return;
        
        const profile = document.getElementById('profile');
        profile.style.display = 'none'; 

        try {
            const response = await fetch(`http://127.0.0.1:1800/api/books/user/${userId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) throw new Error('Ошибка загрузки книг');
    
            const books = await response.json();
            displayBooks(books);
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
            alert('Ошибка загрузки ваших книг.');
        }
    }
    
 
function displayBooks(books) {
    const booksList = document.getElementById('user-books');
    booksList.innerHTML = '';

    books.forEach(book => {
        const category = book.category.name; 
        const tags = book.tags.map(tag => tag.name).join(', ');

        const bookCard = `
            <div class="card">
                ${book.img ? `<img src="${book.img}" alt="${book.title}" class="card-image" />` : ''}
                <h2 class="card-title">${book.title}</h2>
                <p class="card-author"><strong>Автор:</strong> ${book.author.name}</p>
                <p class="card-price"><strong>Цена:</strong> ${book.price} ₽</p>
                <p class="card-category"><strong>Категория:</strong> ${category}</p>
                <p class="card-tags"><strong>Теги:</strong> ${tags}</p>
                <p class="card-published"><strong>Дата публикации:</strong> ${book.published_date}</p>
                <button class="edit-book-btn" data-book-id="${book.id}">Изменить</button>
                <button class="delete-book-btn" data-book-id="${book.id}">Удалить</button>
            </div>
        `;
        booksList.innerHTML += bookCard;
    });

    
    document.querySelectorAll('.edit-book-btn').forEach(button => {
        button.addEventListener('click', (e) => editBookForm(e.target.dataset.bookId));
    });

    document.querySelectorAll('.delete-book-btn').forEach(button => {
        button.addEventListener('click', (e) => deleteBook(e.target.dataset.bookId));
    });

    const createBookButton = document.getElementById('add-book-button');
    createBookButton.addEventListener('click', createBookForm);
}

    
async function createBookForm() {
    const mybooks = document.getElementById('my-books-container');
    mybooks.style.display = 'none'; 
    const formHtml = `
        <div class="book-form-container">
            <h2>Добавить новую книгу</h2>
            <form id="create-book-form" enctype="multipart/form-data">
                <label for="book-title">Название книги:</label>
                <input type="text" id="book-title" name="title" required>

                <label for="book-description">Описание:</label>
                <textarea id="book-description" name="description" required></textarea>

                <label for="book-cover">Обложка (файл):</label>
                <input type="file" id="book-cover" name="img" accept="image/*" required>

                <label for="book-author">Автор:</label>
                <select id="book-author" name="author" required>
                    <!-- Опции с авторами -->
                </select>

                <label for="book-category">Категория:</label>
                <select id="book-category" name="category" required>
                    <!-- Опции с категориями -->
                </select>

                <label for="book-tags">Теги:</label>
                <select id="book-tags" name="tags" multiple required>
                    <!-- Опции с тегами будут загружены -->
                </select>

                <label for="book-price">Цена:</label>
                <input type="number" id="book-price" name="price" required>

                <label for="book-published-date">Дата публикации:</label>
                <input type="date" id="book-published-date" name="published_date" required>

                <button type="submit">Создать книгу</button>
                <button type="button" id="close-create-book-form">Закрыть</button>
            </form>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', formHtml);

    await loadAuthorsForForm(); 
    await loadCategoriesForForm(); 
    await loadTagsForForm();

    document.getElementById('create-book-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createBook();
    });

    document.getElementById('close-create-book-form').addEventListener('click', () => {
        document.querySelector('.book-form-container').remove();
    });
}









async function loadAuthorsForForm() {
    try {
        const response = await fetch('http://127.0.0.1:1800/api/authors/');
        const authors = await response.json();
        const authorSelect = document.getElementById('book-author');
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author.id; 
            option.textContent = author.name; 
            authorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка загрузки авторов:', error);
    }
}

async function loadCategoriesForForm() {
    try {
        const response = await fetch('http://127.0.0.1:1800/api/categories/');
        const categories = await response.json();
        const categorySelect = document.getElementById('book-category');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id; 
            option.textContent = category.name; 
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
}










async function loadTagsForForm() {
    try {
        const response = await fetch('http://127.0.0.1:1800/api/tags/');
        const tags = await response.json();
        const tagsSelect = document.getElementById('book-tags');
        
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag.name; 
            option.textContent = tag.name; 
            tagsSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка загрузки тегов:', error);
    }
}








async function createBook() {
    const { token, userId } = getTokenAndUserId();
    const title = document.getElementById('book-title').value;
    const description = document.getElementById('book-description').value;
    const price = document.getElementById('book-price').value;
    const publishedDate = document.getElementById('book-published-date').value;
    const category = document.getElementById('book-category').value;
    const coverImage = document.getElementById('book-cover').files[0]; 
    const selectedTags = Array.from(document.getElementById('book-tags').selectedOptions).map(option => option.value); 

    const tags = selectedTags.map(tagName => ({
        name: tagName
    }));



    const bookData = new FormData();
    bookData.append('title', title);
    bookData.append('description', description);
    bookData.append('price', price);
    bookData.append('published_date', publishedDate);
    bookData.append('category', category);
    if (coverImage) {
        bookData.append('img', coverImage); 
    }
    bookData.append('user', userId); 

    tags.forEach(tag => {
        bookData.append('tags', JSON.stringify(tag));
    });

    try {
        const response = await fetch('http://127.0.0.1:1800/api/books/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: bookData,
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(`Ошибка создания книги: ${errorData.detail || 'Неизвестная ошибка'}`);
        }

        alert('Книга успешно создана.');
        document.querySelector('.book-form-container').remove();
        loadMyBooks(); 
    } catch (error) {
        console.error('Ошибка создания книги:', error);
        alert('Ошибка создания книги: ' + error.message);
    }
}





    
    async function editBookForm(bookId) {
        const { token } = getTokenAndUserId();
        const mybooks = document.getElementById('my-books-container');
        mybooks.style.display = 'none'; 
    
        try {
            const response = await fetch(`http://127.0.0.1:1800/api/books/${bookId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) throw new Error('Ошибка загрузки книги');
    
            const book = await response.json();
    
            const formHtml = `
                <div class="book-form-container">
                    <h2>Редактировать книгу</h2>
                    <form id="edit-book-form">
                        <label for="edit-book-title">Название книги:</label>
                        <input type="text" id="edit-book-title" value="${book.title}" required />
                        <label for="edit-book-description">Описание:</label>
                        <textarea id="edit-book-description" required>${book.description}</textarea>
                        <label for="edit-book-cover">Обложка (URL):</label>
                        <input type="url" id="edit-book-cover" value="${book.cover_image || ''}" />
                        <button type="submit">Сохранить изменения</button>
                        <button type="button" id="close-edit-book-form">Закрыть</button>
                    </form>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', formHtml);
    
            document.getElementById('edit-book-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                await editBook(bookId);
            });
    
            document.getElementById('close-edit-book-form').addEventListener('click', () => {
                document.querySelector('.book-form-container').remove();
            });
        } catch (error) {
            console.error('Ошибка загрузки книги:', error);
            alert('Ошибка загрузки книги.');
        }
    }
    
    async function editBook(bookId) {
        const { token } = getTokenAndUserId();
        const title = document.getElementById('edit-book-title').value;
        const description = document.getElementById('edit-book-description').value;
        const coverImage = document.getElementById('edit-book-cover').value;
    
        const bookData = {
            title,
            description,
            cover_image: coverImage || null,
        };
    
        try {
            const response = await fetch(`http://127.0.0.1:1800/api/books/${bookId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData),
            });
    
            if (!response.ok) throw new Error('Ошибка обновления книги');
    
            alert('Книга успешно обновлена.');
            document.querySelector('.book-form-container').remove();
            loadMyBooks();
        } catch (error) {
            console.error('Ошибка обновления книги:', error);
            alert('Ошибка обновления книги.');
        }
    }
    
    async function deleteBook(bookId) {
        const { token } = getTokenAndUserId();
    
        if (!confirm('Вы уверены, что хотите удалить эту книгу?')) return;
    
        try {
            const response = await fetch(`http://127.0.0.1:1800/api/books/${bookId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) throw new Error('Ошибка удаления книги');
    
            alert('Книга успешно удалена.');
            loadMyBooks(); 
        } catch (error) {
            console.error('Ошибка удаления книги:', error);
            alert('Ошибка удаления книги.');
        }
    }
    
    
    loadMyBooks();
    






    
    

    async function loginUser(email, password) {
        try {
            const response = await fetch('http://127.0.0.1:1800/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error('Ошибка входа');

            const data = await response.json();
            saveTokenAndUserId(data.token, data.id);
            alert('Вы успешно вошли в систему');
            closeForm();
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Ошибка входа');
        }
    }

    async function logoutUser() {
        const { token } = getTokenAndUserId();
        if (!token) return;

        try {
            const response = await fetch('http://127.0.0.1:1800/api/auth/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Ошибка при выходе из системы');

            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            alert('Вы успешно вышли из системы');
            showAuthButtons();
            profileContainer.style.display = 'none';
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            alert('Ошибка при выходе из системы');
        }
    }

    function getTokenAndUserId() {
        return {
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId'),
        };
    }

    function saveTokenAndUserId(token, userId) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
    }

    function showAuthButtons() {
        loginButton.style.display = 'inline';
        registerButton.style.display = 'inline';
        avatarImg.style.display = 'none'
        logoutButton.style.display = 'none';
    }

    function showLogoutButton() {
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        logoutButton.style.display = 'inline';
    }

   
    function closeForm() {
        window.location.href = '/'; 
    }

  
    function showLoginForm() {
        hideBookElements();
        profileContainer.innerHTML = `
        <img src="/static/img/close.png/" alt="Close" class="close-icon" id="close-login-form-btn">
            <h2>Вход</h2>
            <form id="form-login">
                <input type="email" id="login-email" placeholder="Email" required />
                <input type="password" id="login-password" placeholder="Пароль" required />
                <button type="submit">Войти</button>
            </form>
        `;
        profileContainer.style.display = 'block';

       
        document.getElementById('close-login-form-btn').addEventListener('click', closeForm);

        document.getElementById('form-login').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            await loginUser(email, password);
        });
    }

    
    function showRegisterForm() {
        hideBookElements();
        profileContainer.innerHTML = `
            <img src="/static/img/close.png" alt="Close" class="close-icon" id="close-login-form-btn">
            <h2>Регистрация</h2>
            <form id="form-register" enctype="multipart/form-data">
                <input type="file" id="register-avatar" accept="image/*" />
                <input type="email" id="register-email" placeholder="Email" required />
                <input type="password" id="register-password" placeholder="Пароль" required />
                <input type="password" id="register-password-confirm" placeholder="Подтверждение пароля" required />
                <input type="text" id="register-first-name" placeholder="Имя" required />
                <input type="text" id="register-last-name" placeholder="Фамилия" required />
                <button type="submit">Зарегистрироваться</button>
            </form>
        `;
        profileContainer.style.display = 'block';
    
        document.getElementById('close-login-form-btn').addEventListener('click', closeForm);
    
        document.getElementById('form-register').addEventListener('submit', async (e) => {
            e.preventDefault();
    
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const passwordConfirm = document.getElementById('register-password-confirm').value;
            const firstName = document.getElementById('register-first-name').value;
            const lastName = document.getElementById('register-last-name').value;
            const avatarFile = document.getElementById('register-avatar').files[0];
    
          
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('password2', passwordConfirm);
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            if (avatarFile) {
                formData.append('avatar', avatarFile); 
            }
    
            try {
                const response = await fetch('http://127.0.0.1:1800/api/auth/register/', {
                    method: 'POST',
                    body: formData
                });
    
                if (!response.ok) throw new Error('Ошибка регистрации');
    
                alert('Регистрация успешна. Пожалуйста, войдите в систему.');
                showLoginForm();
            } catch (error) {
                console.error('Ошибка при регистрации:', error);
                alert('Ошибка регистрации');
            }
        });
    }
    
});
