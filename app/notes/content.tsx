import { useEffect, useState } from "react"
import { useContentStore } from "../state/useContentStore"

export default function Content() {
  const { idContent, title, subtitle, content, currentNote, currentFolder, setTitle, setSubtitle, setContent } = useContentStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [idContent, title, subtitle, content, currentNote, currentFolder])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="flex flex-col w-full p-8 pr-16 max-h-screen overflow-auto">
      <div>
        <p className="opacity-40">{currentFolder} / {currentNote.displayTitle}</p>
      </div>
      <div className="mt-4 mb-2">
        <textarea className="font-bold text-3xl px-4 py-2 h-12 w-full overflow-hidden" onChange={
          (e) => { setTitle(e.target.value) }
        } value={title} spellCheck={false} />
        <textarea className="opacity-50 w-full px-4 py-2 overflow-hidden" onChange={
          (e) => { setSubtitle(e.target.value) }
        } value={subtitle} spellCheck={false} />
        <textarea className="w-full h-screen px-4 py-2 overflow-hidden" onChange={
          (e) => { setContent(e.target.value) }
        } value={content} spellCheck={false} />
      </div>
    </div>
  )
}