"use client"
import Image from "next/image"
import { Suspense, useEffect, useState } from "react"
import { useContentStore } from "../state/useContentStore"
import Link from "next/link"
import Loading from "../components/Loading"

export default function Sidebar() {
  const [isOpened, setIsOpened] = useState(true)

  return (
    <div className={`relative border gap-2 border-r-2 flex h-screen min-h-screen flex-col pt-24 transition-all duration-500 z-10 ${isOpened ? 'w-1/3' : 'w-0 px-2'} `}>
      <div className={`absolute left-8 top-12 font-bold text-3xl z-50 ${!isOpened && 'hidden'}`}>
        <Link href={`/`}>
          Notes
        </Link>
      </div>
      <Folders isOpened={isOpened} />
      <InputNewPage isOpened={isOpened} />
      <Slider isOpened={isOpened} setIsOpened={setIsOpened} />
    </div>
  )
}


const Slider = ({ isOpened, setIsOpened }: {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  return (
    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 cursor-pointer"
      onClick={() => setIsOpened(!isOpened)}>
      <div className="bg-slate-200 rounded-full p-2 w-8 h-8 flex items-center">
        <Image src={'/icons/accordion.svg'} height={17} width={17} alt="accordion" className={`transform ${isOpened ? '-rotate-90' : 'rotate-90'} transition-all`} />
      </div>
    </div>
  )
}


const Folders = ({
  isOpened,
}: {
  isOpened: boolean;
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleNewFolder = () => {
    console.log('new folder: ', inputValue)
    setInputValue('')
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleNewFolder()
    }
  }

  return (
    <div className="flex flex-col">
      {[1, 2, 3].map((item, index) => {
        const [isAccordionOpened, setIsAccordionOpened] = useState(false)
        const [isInputOpened, setIsInputOpened] = useState(false)
        return (
          <div className={`hover:bg-slate-100 transition-all p-2 rounded-md pr-4 pl-8 ${!isOpened && 'opacity-0 w-0 hidden'}`} key={index}>
            <div className="flex justify-between">
              <div className="opacity-50 font-medium">Folders {item}</div>
              <div className="flex gap-1">
                <div className="h-4 w-4 relative z-20"
                  onClick={() => setIsInputOpened(!isInputOpened)}
                >
                  <Image src={'/icons/plus.svg'} alt="plus" className="cursor-pointer" fill />
                </div>
                <div className="h-4 w-4 relative"
                  onClick={() => setIsAccordionOpened(!isAccordionOpened)}
                >
                  <Image src={'/icons/accordion.svg'} alt="accordion" className={`cursor-pointer transition-all duration-300 ${!isAccordionOpened ? 'rotate-90' : 'rotate-180'}`} fill />
                </div>
              </div>
            </div>
            <ContentFolders isAccordionOpened={isAccordionOpened} />
            <div className={`${!isInputOpened && 'hidden'} relative`}>
              <div className="absolute top-[10px] left-2 flex items-center pl-2 w-4 h-4 opacity-40">
                <Image src={'/icons/plus.svg'} alt="plus" className="cursor-pointer" fill
                  onClick={handleNewFolder}
                />
              </div>
              <input type="text" placeholder="New Folder" className='border text-sm p-2 px-8'
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        )
      })}
    </div>)
}

async function getData(angka: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000))
}

const ContentFolders = ({
  isAccordionOpened,
}: {
  isAccordionOpened: boolean;
}) => {
  const { setIdContent } = useContentStore()
  const [loading, setLoading] = useState(true)
  if (!isAccordionOpened) return (<></>)
  getData(1).then(() => setLoading(false))

  if (loading) return <Loading size={8} />

  return (
    <div className={`flex flex-col transition-all ${!isAccordionOpened && 'hidden'}`}>
      {[1, 2, 3].map((item, id) => (
        <div className="flex justify-between text-sm p-2 cursor-pointer hover:bg-slate-200" key={id}
          onClick={() => setIdContent(id.toString())}
        >
          <p>Isi Folder {item}</p>
          <div className="flex gap-2 relative">
            <div className="w-4 h-4 relative">
              <Image src={'/icons/edit.svg'} alt="edit" className="cursor-pointer opacity-40" fill />
            </div>
            <div className="w-4 h-4 relative">
              <Image src={'/icons/trash.svg'} alt="trash" className="cursor-pointer" fill />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const InputNewPage = ({
  isOpened,
}: {
  isOpened: boolean;
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleNewPage = () => {
    console.log('new page: ', inputValue)
    setInputValue('')
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleNewPage()
    }
  }
  return (
    <div className={`relative mx-8 ${!isOpened && 'hidden'}`}>
      <div className="absolute top-[10px] left-2 flex items-center pl-2 w-4 h-4 opacity-40">
        <Image src={'/icons/plus.svg'} alt="plus" className="cursor-pointer" fill
          onClick={handleNewPage}
        />
      </div>
      <input type="text" placeholder="New Page" className="border text-sm p-2 px-8"
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}