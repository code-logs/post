import { Page } from '../components/dom-router/types/page.js'

export const pages: Page[] = [
  {
    title: '포스팅',
    tagName: 'post-list',
    route: '/',
  },
  {
    title: '글쓰기',
    tagName: 'create-post',
    route: '/create',
  },
  {
    title: '배포하기',
    tagName: 'deploy-post',
    route: '/deploy',
  },
  {
    title: '설정',
    tagName: 'app-config',
    route: '/config',
  },
  {
    tagName: 'post-detail',
    route: '/posts/:name',
  },
]
