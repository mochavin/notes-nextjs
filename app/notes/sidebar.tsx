'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useContentStore } from '../state/useContentStore';
import Link from 'next/link';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

export default function Sidebar() {
  const [isOpened, setIsOpened] = useState(true);
  const [dataFolder, setDataFolder] = useState<any>([]);
  useEffect(() => {
    const q = query(collection(db, 'folders'));
    onSnapshot(q, (querySnapshot) => {
      let temp: any = [];
      querySnapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      setDataFolder(temp);
    });
  }, []);

  return (
    <div
      className={`relative border gap-2 border-r-2 flex h-screen min-h-screen flex-col pt-24 transition-all duration-500 z-10 ${isOpened ? 'w-1/3' : 'w-0 px-2'
        } `}
    >
      {isOpened && <div className='absolute left-8 top-12 font-bold text-3xl z-50'>
        <Link href={`/`}>Notes</Link>
      </div>}
      <Folders isOpened={isOpened} data={dataFolder} />
      <InputNewPage isOpened={isOpened} />
      <Slider isOpened={isOpened} setIsOpened={setIsOpened} />
    </div>
  );
}

const Slider = ({
  isOpened,
  setIsOpened,
}: {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className='absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 cursor-pointer'
      onClick={() => setIsOpened(!isOpened)}
    >
      <div className='bg-slate-200 rounded-full p-2 w-8 h-8 flex items-center'>
        <Image
          src={'./icons/accordion.svg'}
          height={17}
          width={17}
          alt='accordion'
          className={`transform ${isOpened ? '-rotate-90' : 'rotate-90'
            } transition-all`}
        />
      </div>
    </div>
  );
};

const Folders = ({ isOpened, data }: { isOpened: boolean; data: any }) => {
  return (
    <div className='flex flex-col'>
      {data.map((item: any, index: number) => (
        <div key={index}>
          {isOpened && <Folder item={item} index={index} />}
        </div>
      ))}
    </div>
  );
};

function Folder({ item, index }: { item: any; index: number }) {
  const [isAccordionOpened, setIsAccordionOpened] = useState(false);
  const [isInputOpened, setIsInputOpened] = useState(false);
  const [inputFolder, setInputFolder] = useState('');
  const [notesInFolder, setNotesInFolder] = useState<any>();
  const [triggerToast, setTriggerToast] = useState(false)

  useEffect(() => {
    const temp = async () => {
      const q = query(collection(db, "notes"), where("idNote", "==", item.id));
      const tempArr: any = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        tempArr.push({ ...doc.data(), id: doc.id })
      });
      setNotesInFolder(tempArr);
    }
    temp()
  }, [])

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleNewFolder();
    }
  };

  const handleNewFolder = () => {
    setInputFolder('');
    addFolder();
  };
  const addFolder = async () => {
    await addDoc(collection(db, "notes"), {
      idNote: item.id,
      displayTitle: inputFolder,
      title: "ini judul",
      subtitle: "ini sub title",
      content: "ini content",
      createdAt: new Date(),
    });
    const q = query(collection(db, "notes"), where("idNote", "==", item.id));
    const tempArr: any = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      tempArr.push({ ...doc.data(), id: doc.id })
    });
    setTriggerToast(true)
    // in 2 second set to false
    setTimeout(() => {
      setTriggerToast(false)
    }, 5000)
    setNotesInFolder(tempArr);
  };

  return (
    <div
      className={`hover:bg-slate-100 transition-all p-2 rounded-md pr-4 pl-8`}
      key={index}
    >
      {triggerToast && <div className="toast toast-top toast-center">
        <div className="alert alert-info text-white text-center font-semibold">
          <span>successfully add new folder</span>
        </div>
      </div>}
      <div className='flex justify-between'>
        <div className='opacity-50 font-medium'>{item.name}</div>
        <div className='flex gap-1'>
          <div className='w-4 h-4 relative'
            onClick={() => (document.getElementById(`del_folder` + item.idNote + index) as HTMLDialogElement).showModal()}
          >
            <Image
              src={'./icons/trash.svg'}
              alt='trash'
              className='cursor-pointer'
              fill
            />
          </div>
          <dialog id={`del_folder` + item.idNote + index} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Warning</h3>
              <p className="py-4">Are you sure want to delete <b>{item.name}</b></p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <div className='flex gap-1'>
                    <button className="btn rounded-md btn-outline">
                      Cancel
                    </button>
                    <button className="btn btn-error rounded-md btn-outline"
                      onClick={async () => {
                        await deleteDoc(doc(db, 'folders', item.id));
                        // delete all notes in notes collection where idNote = item.id
                        const q = query(collection(db, "notes"), where("idNote", "==", item.id));

                        const querySnapshot = await getDocs(q);
                        querySnapshot.forEach((i) => {
                          deleteDoc(doc(db, "notes", i.id));
                        });

                      }}
                    >Delete</button>
                  </div>
                </form>
              </div>
            </div>
          </dialog>


          <div
            className='h-4 w-4 relative z-20'
            onClick={() => setIsInputOpened(!isInputOpened)}
          >
            <Image
              src={'./icons/plus.svg'}
              alt='plus'
              className='cursor-pointer'
              fill
            />
          </div>
          <div
            className='h-4 w-4 relative'
            onClick={() => setIsAccordionOpened(!isAccordionOpened)}
          >
            <Image
              src={'./icons/accordion.svg'}
              alt='accordion'
              className={`cursor-pointer transition-all duration-300 ${!isAccordionOpened ? 'rotate-90' : 'rotate-180'
                }`}
              fill
            />
          </div>
        </div>
      </div>
      <ContentFolders isAccordionOpened={isAccordionOpened} notesInFolder={notesInFolder} setNotesInFolder={setNotesInFolder} currentFolder={item.name} />
      <div className={`${!isInputOpened && 'hidden'} relative`}>
        <div className='absolute top-[10px] left-2 flex items-center pl-2 w-4 h-4 opacity-40'
          onClick={handleNewFolder}
        >
          <Image
            src={'./icons/plus.svg'}
            alt='plus'
            className='cursor-pointer'
            fill
          />
        </div>
        <input
          type='text'
          placeholder='New Folder'
          className='border text-sm p-2 px-8'
          onChange={(e) => setInputFolder(e.target.value)}
          onKeyDown={handleKeyDown}
          value={inputFolder}
        />
      </div>
    </div>
  );
}

const ContentFolders = ({
  isAccordionOpened,
  notesInFolder,
  setNotesInFolder,
  currentFolder
}: {
  isAccordionOpened: boolean;
  notesInFolder: any;
  setNotesInFolder: any;
  currentFolder: string;
}) => {
  const {
    currentNote,
    setIdContent,
    setCurrentNote,
    setCurrentFolder,
    setTitle,
    setSubtitle,
    setContent,
  } = useContentStore();
  const [toggleEdit, setToggleEdit] = useState(-1)
  const [inputEditDisplay, setInputEditDisplay] = useState('')

  if (!isAccordionOpened) return <></>;

  const handleClickNote = async (item: any) => {
    const docRef = doc(db, 'notes', item.id)
    const docSnap = await getDoc(docRef);
    const data = docSnap.data()
    setCurrentFolder(currentFolder);
    setCurrentNote(data ? data : {
      displayTitle: '',
      title: '',
      subtitle: '',
      content: '',
    });
    setIdContent(item.id);
    setTitle(data?.title);
    setSubtitle(data?.subtitle);
    setContent(data?.content);
  }

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteDoc(doc(db, 'notes', notesInFolder[id].id))
    } catch (error) {
      console.log(error)
    }
    setCurrentNote({
      displayTitle: '',
      title: '',
      subtitle: '',
      content: '',
    })
    setNotesInFolder(notesInFolder.filter((item: any, index: number) => index !== id))
  }

  const handleEditDisplayNote = async (id: string, index: number) => {
    setToggleEdit(toggleEdit == -1 ? index : -1)
    // update display Note by id
    const noteRef = doc(db, "notes", id);
    const docSnap = await getDoc(noteRef);
    const data = docSnap.data()
    await updateDoc(noteRef, {
      ...data,
      displayTitle: inputEditDisplay
    });
    setCurrentNote({
      ...currentNote,
      displayTitle: inputEditDisplay
    })
    let updatedNotes = [...notesInFolder];
    updatedNotes[index] = {
      ...updatedNotes[index],
      displayTitle: inputEditDisplay
    };
    setNotesInFolder(updatedNotes);
  }

  return (
    <div
      className={`flex flex-col transition-all ${!isAccordionOpened && 'hidden'
        }`}
    >
      {notesInFolder.length === 0 && (
        <div className='text-sm p-2 cursor-pointer hover:bg-slate-200'>
          No notes
        </div>
      )}
      {notesInFolder.map((item: any, id: any) => (
        <div
          className='flex justify-between text-sm p-2 cursor-pointer hover:bg-slate-200'
          key={id}
          onClick={() => {
            handleClickNote(item)
          }}
        >
          {toggleEdit == id ?
            <input defaultValue={item.displayTitle}
              onChange={(e) => setInputEditDisplay(e.target.value)}
              className='p-1 -m-1 rounded-md w-36' />
            :
            <p>{item.displayTitle}</p>}
          <div className='flex gap-2 relative'>
            <div className='w-4 h-4 relative'
              onClick={() => handleEditDisplayNote(item.id, id)}
            >
              <Image
                src={'./icons/edit.svg'}
                alt='edit'
                className='cursor-pointer opacity-40'
                fill
              />
            </div>
            <div className='w-4 h-4 relative'
              onClick={() => (document.getElementById(`del_note` + item.idNote + id) as HTMLDialogElement).showModal()}
            >
              <Image
                src={'./icons/trash.svg'}
                alt='trash'
                className='cursor-pointer'
                fill
              />
            </div>
            <dialog id={`del_note` + item.idNote + id} className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Warning</h3>
                <p className="py-4">Are you sure want to delete <b>{item.displayTitle}</b></p>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <div className='flex gap-1'>
                      <button className="btn rounded-md btn-outline">
                        Cancel
                      </button>
                      <button className="btn btn-error rounded-md btn-outline"
                        onClick={() => handleDeleteNote(id)}
                      >Delete</button>
                    </div>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      ))
      }
    </div >
  );
};

const InputNewPage = ({ isOpened }: { isOpened: boolean }) => {
  const [inputValue, setInputValue] = useState('');

  const handleNewPage = () => {
    addFolder();
    setInputValue('');
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleNewPage();
    }
  };
  const addFolder = async () => {
    const docRef = await addDoc(collection(db, 'folders'), {
      name: inputValue,
      createdAt: new Date(),
    });
  };
  return (
    <div className={`relative mx-8 ${!isOpened && 'hidden'}`}>
      <div className='absolute top-[10px] left-2 flex items-center pl-2 w-4 h-4 opacity-40'>
        <Image
          src={'./icons/plus.svg'}
          alt='plus'
          className='cursor-pointer'
          fill
          onClick={handleNewPage}
        />
      </div>
      <input
        type='text'
        placeholder='New Page'
        className='border text-sm p-2 px-8'
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
