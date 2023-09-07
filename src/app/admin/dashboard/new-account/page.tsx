import React from 'react'
import RegisterForm from './components/RegisterForm'

type Props = {}

const Page = (props: Props) => {
  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <RegisterForm />
    </div>
  )
}

export default Page