import React from 'react'
import Category from './Category/Category'
import Tags from './Tags/Tags'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'

const Filter = () => {
  return (
    <div className='flex flex-col gap-4 '>
      <Card className='p-3 sticky top-10 gap-3'>
        <div className='flex justify-between lg:w-[20rem] '>
          <p className='text-xl -tracking-wide'>
            Filter by Sheet
          </p>
          <Button variant="ghost" size="icon">
            <MixerHorizontalIcon ></MixerHorizontalIcon>
          </Button>

        </div>
        <Category />
        <Tags />
      </Card>
    </div>
  )
}

export default Filter