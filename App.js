import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('books');
    return savedBooks ? JSON.parse(savedBooks) : [];
  });
  const [spineTitle, setSpineTitle] = useState('');
  const [fullTitle, setFullTitle] = useState('');
  const [style, setStyle] = useState('spooky');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const addBook = () => {
    if (spineTitle && fullTitle) {
      const styleCount = { spooky: 10, colorful: 13, soft: 14, fantasy: 7 };
      const randomNumber = Math.floor(Math.random() * styleCount[style]) + 1;
      const newBook = {
        id: Date.now(),
        spineTitle,
        fullTitle,
        style,
        spineImage: `${style}-${randomNumber}.png`,
        progress: 0
      };
      setBooks([...books, newBook]);
      setSpineTitle('');
      setFullTitle('');
    }
  };

  const updateBook = (id, updatedFields) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, ...updatedFields } : book
    ));
    setSelectedBook(prev => 
      prev && prev.id === id ? { ...prev, ...updatedFields } : prev
    );
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
    setSelectedBook(null);
  };

  const getBookPosition = (index) => {
    const bookWidth = 20; // Reduced width
    const bookOverlap = 10; // Adjusted overlap
    const startX = 105; // Adjusted to fit inside jar
    const startY = 70; // Adjusted to start from bottom of jar
    const shelfHeight = 65; // Adjusted shelf height
    const booksPerShelf = 7; // Increased books per shelf
    
    const shelfIndex = Math.floor(index / booksPerShelf);
    const bookIndexOnShelf = index % booksPerShelf;
    
    const left = startX + (bookIndexOnShelf * (bookWidth - bookOverlap));
    const bottom = startY + (shelfIndex * shelfHeight);
    
    return { left, bottom };
  };

  return (
    <div className="App">
      <div className="bookshelf-container">
        <img src="/bookshelf.jpg" alt="Bookshelf" className="bookshelf-image" />
        <div className="books-overlay">
          {books.map((book, index) => {
            const { left, bottom } = getBookPosition(index);
            return (
              <div
                key={book.id}
                className="book"
                style={{
                  backgroundImage: `url(/spines/${book.spineImage})`,
                  left: `${left}px`,
                  bottom: `${bottom}px`,
                  width: '20px', // Reduced width
                  height: '80px', // Reduced height
                  position: 'absolute',
                  zIndex: index,
                }}
                onClick={() => setSelectedBook(book)}
              >
                <span className="spine-title">{book.spineTitle}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="input-form">
        <input
          type="text"
          placeholder="Spine Title"
          value={spineTitle}
          onChange={(e) => setSpineTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Full Title"
          value={fullTitle}
          onChange={(e) => setFullTitle(e.target.value)}
        />
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="spooky">Spooky</option>
          <option value="colorful">Colorful</option>
          <option value="soft">Soft</option>
          <option value="fantasy">Fantasy</option>
        </select>
        <button onClick={addBook}>Add Book</button>
      </div>
      {selectedBook && (
        <div className="book-details">
          <h2>{selectedBook.fullTitle}</h2>
          <input
            type="range"
            min="0"
            max="100"
            value={selectedBook.progress}
            onChange={(e) => updateBook(selectedBook.id, { progress: parseInt(e.target.value) })}
          />
          <p>Progress: {selectedBook.progress}%</p>
          <button onClick={() => deleteBook(selectedBook.id)}>Delete</button>
          <button onClick={() => setSelectedBook(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;