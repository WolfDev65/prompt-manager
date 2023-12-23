import Heading from '@/components/heading'
import PromptPanel from '@/components/promptPanel'
import Image from 'next/image'

export default function Home() {
  return (
   <div>
    <Heading subtitle={'Save Your Prompt Here'} title={"PROMPT MANAGER"}/>
    <PromptPanel/>
   </div>
  )
}
