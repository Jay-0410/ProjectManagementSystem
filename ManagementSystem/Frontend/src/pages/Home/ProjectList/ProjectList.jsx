import React from 'react'
import ProjectCard from './ProjectCard/ProjectCard'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area';

const ProjectList = () => {
  const [keyword, setKeyword] = React.useState('');
  return (
    <ScrollArea className='max-h-[91vh] border-none py-0'>
      <div className='flex  gap-4  flex-wrap justify-start px-4 w-full '>
        {
          keyword ?
          [1,1,1].map((item, index) => <ProjectCard key={index} />) :
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item, index) => <ProjectCard key={index} />)
        }
      </div>
    </ScrollArea>
  )
}

export default ProjectList