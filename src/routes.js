const { saveBook, getAllBooks, getDetailById, updateBookById, deleteBookById } = require('./handler')
const routes =

[
  {
    method: 'POST',
    path: '/books',
    handler: saveBook
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailById
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookById
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookById
  }
]

module.exports = { routes }
