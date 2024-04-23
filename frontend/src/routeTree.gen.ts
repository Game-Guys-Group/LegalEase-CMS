/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardClientsIndexImport } from './routes/dashboard/clients/index'
import { Route as DashboardClientsAddFileImport } from './routes/dashboard/clients/add-file'
import { Route as DashboardClientsAddClientImport } from './routes/dashboard/clients/add-client'

// Create Virtual Routes

const LoginLazyImport = createFileRoute('/login')()
const DashboardLazyImport = createFileRoute('/dashboard')()
const CreateaccountLazyImport = createFileRoute('/create_account')()
const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()
const DashboardDashboardLazyImport = createFileRoute('/dashboard/dashboard')()
const DashboardClientsLazyImport = createFileRoute('/dashboard/clients')()
const DashboardAnalyticsLazyImport = createFileRoute('/dashboard/analytics')()

// Create/Update Routes

const LoginLazyRoute = LoginLazyImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login.lazy').then((d) => d.Route))

const DashboardLazyRoute = DashboardLazyImport.update({
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/dashboard.lazy').then((d) => d.Route))

const CreateaccountLazyRoute = CreateaccountLazyImport.update({
  path: '/create_account',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/create_account.lazy').then((d) => d.Route),
)

const AboutLazyRoute = AboutLazyImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const DashboardDashboardLazyRoute = DashboardDashboardLazyImport.update({
  path: '/dashboard',
  getParentRoute: () => DashboardLazyRoute,
} as any).lazy(() =>
  import('./routes/dashboard/dashboard.lazy').then((d) => d.Route),
)

const DashboardClientsLazyRoute = DashboardClientsLazyImport.update({
  path: '/clients',
  getParentRoute: () => DashboardLazyRoute,
} as any).lazy(() =>
  import('./routes/dashboard/clients.lazy').then((d) => d.Route),
)

const DashboardAnalyticsLazyRoute = DashboardAnalyticsLazyImport.update({
  path: '/analytics',
  getParentRoute: () => DashboardLazyRoute,
} as any).lazy(() =>
  import('./routes/dashboard/analytics.lazy').then((d) => d.Route),
)

const DashboardClientsIndexRoute = DashboardClientsIndexImport.update({
  path: '/',
  getParentRoute: () => DashboardClientsLazyRoute,
} as any)

const DashboardClientsAddFileRoute = DashboardClientsAddFileImport.update({
  path: '/add-file',
  getParentRoute: () => DashboardClientsLazyRoute,
} as any)

const DashboardClientsAddClientRoute = DashboardClientsAddClientImport.update({
  path: '/add-client',
  getParentRoute: () => DashboardClientsLazyRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/create_account': {
      preLoaderRoute: typeof CreateaccountLazyImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      preLoaderRoute: typeof DashboardLazyImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/analytics': {
      preLoaderRoute: typeof DashboardAnalyticsLazyImport
      parentRoute: typeof DashboardLazyImport
    }
    '/dashboard/clients': {
      preLoaderRoute: typeof DashboardClientsLazyImport
      parentRoute: typeof DashboardLazyImport
    }
    '/dashboard/dashboard': {
      preLoaderRoute: typeof DashboardDashboardLazyImport
      parentRoute: typeof DashboardLazyImport
    }
    '/dashboard/clients/add-client': {
      preLoaderRoute: typeof DashboardClientsAddClientImport
      parentRoute: typeof DashboardClientsLazyImport
    }
    '/dashboard/clients/add-file': {
      preLoaderRoute: typeof DashboardClientsAddFileImport
      parentRoute: typeof DashboardClientsLazyImport
    }
    '/dashboard/clients/': {
      preLoaderRoute: typeof DashboardClientsIndexImport
      parentRoute: typeof DashboardClientsLazyImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  AboutLazyRoute,
  CreateaccountLazyRoute,
  DashboardLazyRoute.addChildren([
    DashboardAnalyticsLazyRoute,
    DashboardClientsLazyRoute.addChildren([
      DashboardClientsAddClientRoute,
      DashboardClientsAddFileRoute,
      DashboardClientsIndexRoute,
    ]),
    DashboardDashboardLazyRoute,
  ]),
  LoginLazyRoute,
])

/* prettier-ignore-end */
