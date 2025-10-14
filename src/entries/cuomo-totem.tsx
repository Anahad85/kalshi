import React from 'react'
import ReactDOM from 'react-dom/client'
import MSGTotem from '../MSGTotem'
import '../index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MSGTotem candidate="cuomo" />
  </React.StrictMode>,
)

