import { useEffect, useState } from "react"
import { useContentStore } from "../state/useContentStore"

export default function Content() { 
  const { idContent, title, subtitle, content } = useContentStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // console.log('bears: ', bears)
    setLoading(false)
  }, [idContent])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  console.log('idContent: ', idContent)

  return (
    <div className="flex flex-col w-full p-8 pr-16 max-h-screen overflow-auto">
      <div>
        <p className="opacity-40">college / {idContent}</p>
      </div>
      <div className="mt-4 mb-2">
        <textarea className="font-bold text-3xl px-4 py-2 h-12 w-full overflow-hidden" defaultValue={title} spellCheck={false} />
        <textarea className="opacity-50 w-full px-4 py-2 overflow-hidden" defaultValue={subtitle} spellCheck={false} />
        <textarea className="w-full h-screen px-4 py-2 overflow-hidden" defaultValue={content} spellCheck={false} />
      </div>
    </div>
  )
}