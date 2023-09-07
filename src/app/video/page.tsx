import React from 'react'
import VideoCall from '../feed/components/VideoCall'
import dynamic from 'next/dynamic';
const InviteBtn = dynamic(() => import('../feed/components/videoInvite'), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => <div>Loading...</div>, // Optional loading indicator
})


type Props = {}

const Page = (props: Props) => {
  return (
    <InviteBtn />
  )
}

export default Page