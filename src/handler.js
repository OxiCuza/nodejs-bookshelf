const { v4: uuidv4 } = require('uuid')
const books = require('./books')

const storeBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id: uuidv4(),
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === newBook.id).length > 0

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: newBook.id
      }
    }).code(201)
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  }).code(400)
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  let filteredBooks = resourceBooks(books)

  if (name) {
    const lowerName = name.toLowerCase()
    filteredBooks = resourceBooks(books.filter((book) => book.name.toLowerCase().includes(lowerName)))
  }

  if (reading) {
    filteredBooks = resourceBooks(books.filter((book) => book.reading === (reading === '1')))
  }

  if (finished) {
    filteredBooks = resourceBooks(books.filter((book) => book.finished === (finished === '1')))
  }

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks
    }
  }).code(200)
}

const resourceBooks = (books) => {
  return books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((book) => book.id === bookId)[0]

  if (book) {
    return h.response({
      status: 'success',
      data: {
        book
      }
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
}

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404)
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload
  const updatedAt = new Date().toISOString()

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt
  }

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  }).code(200)
}

const destroyBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404)
  }

  books.splice(index, 1)

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  }).code(200)
}

module.exports = {
  storeBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  destroyBookByIdHandler
}
