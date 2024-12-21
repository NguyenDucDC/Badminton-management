import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const year = new Date().getFullYear()
  return (
    <CFooter>
      <div>
        Copyright
        <span className="ms-1">&copy; {year} PipGo. All Rights Reserved.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="#" target="_blank" rel="noopener noreferrer">
          PipGo Team
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
