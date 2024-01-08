"use client"
import Sidebar from "./sidebar"
import Content from "./content"
import Image from "next/image"
import { useState } from "react"
import { useContentStore } from "../state/useContentStore"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"

export default function Notes() {
  return (
    <main className="relative flex h-screen min-h-screen items-center justify-between">
      <div className="flex w-full h-full fixed">
        <Sidebar />
        <div className='relative flex flex-col w-full'>
          <Content />
          <Save />
        </div>
      </div>
    </main>
  )
}

function Save() {
  const { idContent, title, subtitle, content, currentNote } = useContentStore()
  const [triggerToast, setTriggerToast] = useState(false)

  const handleSave = async () => {
    const docRef = doc(db, 'notes', idContent)
    let temp = {
      ...currentNote,
      title: title,
      subtitle: subtitle,
      content: content,
    }

    await updateDoc(docRef, temp)
    setTriggerToast(true)
    setTimeout(() => {
      setTriggerToast(false)
    }, 5000)
  }

  return (
    <div
      className="absolute bottom-0 w-full h-36 p-4 rounded-tl-lg bg-gradient-to-b from-transparent to-slate-100 flex items-center justify-center">
      {triggerToast && <div className="toast toast-top toast-center">
        <div className="alert alert-info text-white text-center font-semibold w-full">
          <span className="md:pl-4">Saved</span>
        </div>
      </div>}
      <div className="absolute right-36 bottom-12 cursor-pointer">
        <div className="w-24 border bg-slate-600 p-2 flex gap-3 rounded-lg"
          onClick={handleSave}
        >
          <div className="w-5 h-5 relative"          >
            <Image src={'./icons/save.svg'} fill alt="save" />
          </div>
          <p className="text-white text-center opacity-80">Save</p>
        </div>
      </div>
    </div>
  )
}