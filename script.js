let books = JSON.parse(localStorage.getItem("books")) || [];
let showFavorites = false;

function truncateText(text, maxLength = 50) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function renderBooks(filtered = books) {
  const list = document.getElementById("booksList");
  list.innerHTML = "";

  filtered.forEach((book, index) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <div class="book-header">
        <h3>${truncateText(book.title)}</h3>
        <span class="favorite-star ${book.favorite ? "active" : ""}" onclick="toggleFavorite(${index})">★</span>
      </div>
      <p><strong>Author:</strong> ${truncateText(book.author || "Unknown")}</p>
      <p><strong>Rating:</strong> ⭐ ${book.rating || "N/A"}</p>
      <p><strong>Page:</strong> ${truncateText(book.page?.toString() || "0")}</p>
      <p><strong>Notes:</strong> ${truncateText(book.notes || "No notes")}</p>
      <div class="card-buttons">
        <button class="edit-btn" onclick="editPage(${index})">Edit Page</button>
        <button class="edit-btn" onclick="editNotes(${index})">Edit Notes</button>
        <button class="edit-btn delete-btn" onclick="deleteBook(${index})">Delete</button>
      </div>
    `;
    list.appendChild(card);
  });

  localStorage.setItem("books", JSON.stringify(books));
}

function deleteBook(index) {
  if (confirm(`Delete "${books[index].title}" from your library?`)) {
    books.splice(index, 1);
    renderBooks();
  }
}

document.getElementById("addBook").addEventListener("click", () => {
  const title = document.getElementById("title").value.trim();
  if (!title) return alert("Please enter a book title!");

  const newBook = {
    title,
    author: document.getElementById("author").value,
    rating: document.getElementById("rating").value,
    notes: document.getElementById("notes").value,
    page: document.getElementById("page").value,
    favorite: false,
  };

  books.push(newBook);
  renderBooks();

  document.querySelectorAll("#title, #author, #rating, #notes, #page").forEach(el => (el.value = ""));
});

document.getElementById("clearAll").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all your books?")) {
    localStorage.clear();
    books = [];
    renderBooks();
  }
});

function editPage(index) {
  const newPage = prompt("Enter the new page number:", books[index].page);
  if (newPage !== null) {
    books[index].page = newPage;
    renderBooks();
  }
}

function editNotes(index) {
  const newNotes = prompt("Edit your notes:", books[index].notes);
  if (newNotes !== null) {
    books[index].notes = newNotes;
    renderBooks();
  }
}

function toggleFavorite(index) {
  books[index].favorite = !books[index].favorite;
  renderBooks();
}

/* 🔍 Search and Filter */
const searchInput = document.getElementById("searchInput");
const ratingFilter = document.getElementById("ratingFilter");
const toggleFavoritesBtn = document.getElementById("toggleFavorites");

searchInput.addEventListener("input", filterBooks);
ratingFilter.addEventListener("change", filterBooks);
toggleFavoritesBtn.addEventListener("click", () => {
  showFavorites = !showFavorites;
  toggleFavoritesBtn.classList.toggle("active", showFavorites);
  filterBooks();
});

function filterBooks() {
  const searchValue = searchInput.value.toLowerCase();
  const ratingValue = ratingFilter.value;

  let filtered = books.filter(book =>
    book.title.toLowerCase().includes(searchValue) ||
    book.author.toLowerCase().includes(searchValue)
  );

  if (ratingValue !== "all") {
    filtered = filtered.filter(book => Number(book.rating) >= Number(ratingValue));
  }

  if (showFavorites) {
    filtered = filtered.filter(book => book.favorite);
  }

  renderBooks(filtered);
}

renderBooks();
