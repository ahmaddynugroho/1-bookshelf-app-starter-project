/**
 * @typedef {{
 *  id: string | number,
 *  title: string,
 *  author: string,
 *  year: number,
 *  isComplete: boolean,
 * }} Book
 */

const q = (query) => document.querySelector(query);

/** @type {{complete: Book[], incomplete: Book[]}} */
let shelfs = {
  complete: [],
  incomplete: [],
};

const shelfsStorage = JSON.parse(localStorage.getItem("shelfs"));
if (shelfsStorage) {
  shelfs = shelfsStorage;
  render();
}

function changeCompleteStatus(id, isComplete) {
  const shelf = isComplete ? "complete" : "incomplete";
  const otherShelf = isComplete ? "incomplete" : "complete";
  const bookIndex = shelfs[shelf].findIndex((book) => book.id === id);
  const book = shelfs[shelf].splice(bookIndex, 1)[0];
  book.isComplete = !isComplete;
  shelfs[otherShelf].push(book);
  save();
  render();
}

function deleteBook(id, isComplete) {
  const shelf = isComplete ? "complete" : "incomplete";
  shelfs[shelf] = shelfs[shelf].filter((book) => book.id !== id);
  save();
  render();
}

function save() {
  localStorage.setItem("shelfs", JSON.stringify(shelfs));
}

function render() {
  /** @param {Book} book */
  const setHTML = (book) => `
    <div data-bookid="${book.id}" data-testid="bookItem">
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button onclick="changeCompleteStatus(${book.id}, ${
    book.isComplete
  })" data-testid="bookItemIsCompleteButton">${
    book.isComplete ? "Belum" : "Selesai"
  } dibaca</button>
        <button onclick="deleteBook(${book.id}, ${
    book.isComplete
  })" data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    </div>
  `;
  const complete = q("#completeBookList");
  complete.innerHTML = "";
  shelfs.complete.forEach((book) => {
    complete.innerHTML += setHTML(book);
  });
  const incomplete = q("#incompleteBookList");
  incomplete.innerHTML = "";
  shelfs.incomplete.forEach((book) => {
    incomplete.innerHTML += setHTML(book);
  });
}

q("#bookForm").onsubmit = (e) => {
  e.preventDefault();
  const data = {
    id: Date.now(),
    title: q("#bookFormTitle").value,
    author: q("#bookFormAuthor").value,
    year: Number(q("#bookFormYear").value),
    isComplete: q("#bookFormIsComplete").checked,
  };
  if (data.isComplete) shelfs.complete.push(data);
  if (!data.isComplete) shelfs.incomplete.push(data);
  save();
  render();
};
