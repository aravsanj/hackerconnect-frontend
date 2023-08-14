"use client"
import { Typography } from 'antd'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='h-screen flex justify-center items-center'>
        <Typography.Title level={1} className='mb-0 pb-0'>
            Settings
        </Typography.Title>
    </div>
  )
}

export default page