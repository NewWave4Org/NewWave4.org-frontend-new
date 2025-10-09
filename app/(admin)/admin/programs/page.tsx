import ProgramsTable from '@/components/admin/ProgramsTable/ProgramsTable'
import { pagesData } from '@/utils/constants/programsdata'
import React from 'react'

function ProgramsPage() {
  return (
    <div>
      <ProgramsTable pagesData={pagesData} />
    </div>
  )
}

export default ProgramsPage