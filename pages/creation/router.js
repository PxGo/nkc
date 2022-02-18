import Home from './views/Home';
import Materials from './views/material/Material';
import Material from './views/material/MaterialFolder';
import DocumentEditor from './views/material/DocumentEditor'
import Books from './views/book/Books';
import Book from './views/book/Book';
import BookContent from './views/book/BookContent';
import BookEditor from './views/book/BookEditor';
import ArticleEditor from './views/article/ArticleEditor';
import Categories from './views/category/Categories';
import Drafts from './views/drafts/drafts';
import DraftEdit from "./views/drafts/DraftEdit";
const routes = [
  {name: 'home', path: '/creation', component: Home},
  {name: 'materials', path: '/creation/materials', component: Materials},
  {name: 'material', path: '/creation/material/:id', component: Material},
  {name: 'books', path: '/creation/books', component: Books},
  {name: 'addDocument', path: '/creation/materials/editor', component: DocumentEditor},
  {name: 'book', path: '/creation/book/:bid', component: Book},
  {name: 'bookContent', path: '/creation/book/:bid/:aid', component: BookContent},
  {name: 'bookEditor', path: '/creation/books/editor', component: BookEditor},
  {name: 'articleEditor', path: '/creation/articles/editor', component: ArticleEditor},
  {name: 'categories', path: '/creation/categories', component: Categories},
  {name: 'drafts', path: '/creation/drafts', component: Drafts},
  {name: 'draftEdit', path: '/creation/drafts/editor', component: DraftEdit},
];


// 防止路由重复点击报错

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;