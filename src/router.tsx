import AppShellLayout from './layout/app-shell'
import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    element: <AppShellLayout />,
    children: [
      {
        path: '/familias',
        lazy: lazyComponent(import('./families/pages/families-list-page')),
      },
      {
        path: '/familias/:familyId',
        lazy: lazyComponent(import('./families/pages/family-detail-page')),
      },
    ],
  },
  {
    path: '/',
    lazy: lazyComponent(import('./home/home-route')),
  },
])

function lazyComponent<T>(module: Promise<ModuleWithDefault<T>>) {
  return async () => {
    const { default: Component } = await module
    return { Component }
  }
}

interface ModuleWithDefault<T> {
  default: T
}
