document.addEventListener('DOMContentLoaded', () => {
    const booksContainer = document.getElementById('books-container');
    const bookIdInput = document.getElementById('book-id');
    const searchButton = document.getElementById('search-button');
    const burgerMenu = document.getElementById('burger-menu');
    const menu = document.getElementById('menu');

    // Функция для загрузки всех книг с API
    const loadAllBooks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:1800/api/books/');
            const data = await response.json();
            displayBooks(data.results);
        } catch (error) {
            console.error('Error loading books:', error);
        }
    };

    // Функция для отображения книг
    const displayBooks = (books) => {
        booksContainer.innerHTML = ''; // Очистка контейнера перед отображением
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('book-card');

            bookCard.innerHTML = `
                <img src="${book.img}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>by ${book.author}</p>
                <p>${book.description}</p>
                <div class="price">${book.price}</div>
            `;

            booksContainer.appendChild(bookCard);
        });
    };

    // Функция для загрузки книги по ID
    const loadBookById = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:1800/api/books/${id}/`);
            if (response.ok) {
                const book = await response.json();
                displayBooks([book]); // Отображение только одной книги
            } else {
                booksContainer.innerHTML = '<p>Книга не найдена.</p>';
            }
        } catch (error) {
            console.error('Error loading book:', error);
        }
    };

    // Функция для обработки поиска
    const handleSearch = () => {
        const id = bookIdInput.value;
        if (id) {
            loadBookById(id);
        } else {
            loadAllBooks(); // Если ID не указан, загружаем все книги
        }
    };

    // Обработчик события для кнопки поиска и нажатия клавиши Enter
    searchButton.addEventListener('click', handleSearch);
    bookIdInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // Обработчик события для бургер-меню
    burgerMenu.addEventListener('click', () => {
        menu.classList.toggle('active'); // Переключение видимости меню
    });

    // Инициализация загрузки всех книг при загрузке страницы
    loadAllBooks();
});
