import React from 'react'
import ReactDOM from 'react-dom/client'
import OptionsPage from './OptionsPage'
import '../index.css' // 确保 Tailwind 样式被加载

ReactDOM.createRoot(document.getElementById('options-root')!).render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>,
)
