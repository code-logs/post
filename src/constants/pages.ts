import { Page } from '../components/dom-router/types/page.js'

export const pages: Page[] = [
  {
    title: '글쓰기',
    tagName: 'create-post',
    importPath: '../../pages/create-post.js',
    route: '/create',
  },
  {
    title: '포스팅',
    tagName: 'post-list',
    importPath: '../../pages/post-list.js',
    route: '/',
  },
]