import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'antd/dist/reset.css'
import AppLayout from './components/layout/AppLayout'
import TodoPage from './pages/TodoPage/TodoPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <TodoPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
