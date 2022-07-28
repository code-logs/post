import { Page } from '../components/dom-router/types/page.js'

export const pages: Page[] = [
  {
    title: '포스팅',
    tagName: 'post-list',
    importPath: '../../pages/post-list.js',
    route: '/',
  },
  {
    title: '글쓰기',
    tagName: 'create-post',
    importPath: '../../pages/create-post.js',
    route: '/create',
  },
  {
    title: '배포하기',
    tagName: 'deploy-post',
    importPath: '../../pages/deploy-post.js',
    route: '/deploy',
  },
  {
    title: '설정',
    tagName: 'app-config',
    importPath: '../../pages/app-config.js',
    route: '/config',
  },
  {
    tagName: 'post-detail',
    importPath: '../../pages/post-detail.js',
    route: '/posts/:name',
  },
]
