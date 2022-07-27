const { nanoid } = require('nanoid')
const books = require('./books')

// kRITERIA 1
// MENTIMPAN BUKU
const saveBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = readPage === pageCount

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  };

  const isReadPageBigger = pageCount < readPage
  if (isReadPageBigger) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const saveNewBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }

  books.push(saveNewBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (!isSuccess) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan'
    })

    response.code(500)
    return response
  } else {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })

    response.code(201)
    return response
  }
}

// KRITERIA 2
// MENAMPILKAN SELURUH BUKU
const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query
  let getFilteredBooks = books

  if (name !== undefined) {
    getFilteredBooks = getFilteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (reading !== undefined) {
    getFilteredBooks = getFilteredBooks.filter((book) => book.reading === !!Number(reading))
  }

  if (finished !== undefined) {
    getFilteredBooks = getFilteredBooks.filter((book) => book.finished === !!Number(finished))
  }

  const response = h.response({
    status: 'success',
    data: {
      books: getFilteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })
  response.code(200)
  return response
}

// KRITERIA 3
// MENAMPILKAN DETAIL BUKU

const getDetailById = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((book) => book.id === bookId)[0]

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })

    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })

  response.code(404)
  return response
}

// KRITERIA 4
// MEGUBAH DATA BUKU

const updateBookById = (request, h) => {
  const { bookId } = request.params

  // eslint-disable-next-line no-unused-vars
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    const checkNameNotExist = name === '' || name === undefined
    if (checkNameNotExist) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }

    const checkReadPage = readPage > pageCount
    if (checkReadPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }
    const updatedAt = new Date().toISOString()
    books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

// DELETE BOOK BY ID
const deleteBookById = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }

  books.splice(index, 1)
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  })
  response.code(200)
  return response
}

module.exports = { saveBook, getAllBooks, getDetailById, updateBookById, deleteBookById }
