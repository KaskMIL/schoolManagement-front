import AuthGuard from './auth/auth-guard'
import AppShellLayout from './layout/app-shell'
import { createBrowserRouter, Navigate } from 'react-router'

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
          {
            path: '/configuracion',
            lazy: lazyComponent(import('./configuracion/configuracion-layout')),
            children: [
              {
                index: true,
                element: <Navigate to="/configuracion/usuarios" replace />,
              },
              {
                path: 'usuarios',
                lazy: lazyComponent(import('./users/pages/users-config-page')),
              },
              {
                path: 'instituciones',
                lazy: lazyComponent(import('./institutions/pages/institutions-config-page')),
              },
              {
                path: 'precios',
                lazy: lazyComponent(import('./configuracion/pages/precios-config-page')),
              },
              {
                path: 'general',
                lazy: lazyComponent(import('./configuracion/pages/general-config-page')),
              },
              {
                path: 'descuentos',
                lazy: lazyComponent(import('./configuracion/pages/descuentos-config-page')),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    lazy: lazyComponent(import('./auth/login-page')),
  },
  {
    path: '/',
    element: <Navigate to={'login'} />,
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
