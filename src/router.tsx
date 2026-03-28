import AuthGuard from './auth/auth-guard'
import AppShellLayout from './layout/app-shell'
import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    element: <AuthGuard />,
    children: [
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
          {
            path: '/alumnos',
            lazy: lazyComponent(import('./students/pages/students-list-page')),
          },
          {
            path: '/alumnos/:studentId',
            lazy: lazyComponent(import('./students/pages/student-detail-page')),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    lazy: lazyComponent(import('./auth/login-page')),
  },
  // {
  //   path: '/',
  //   lazy: lazyComponent(import('./home/home-route')),
  // },
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
