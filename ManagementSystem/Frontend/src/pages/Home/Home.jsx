import React from 'react'
import ProjectList from './ProjectList/ProjectList'
import Filter from './Filter/Filter'

const Body = () => {
  return (
    <div className='flex gap-7 px-5 lg:px-10 py-5  shadow-md'>
      <Filter></Filter>
      <div className='w-full lg:w-full flex flex-col gap-4'>
        <ProjectList></ProjectList>
      </div>

    </div>
  )
}

export default Body