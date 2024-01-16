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
import { useStateStore } from '../state/useStateStore';

interface Folder {
  name: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  id: string;
}

interface Note {
  id: string;
  title: string;
  idNote: string;
  content: string;
  displayTitle: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  subtitle: string;
}

export default function Sidebar() {
  const { isSidebarOpen } = useStateStore();

  return (
    <div
      className={`relative border gap-2 border-r-2 flex h-screen min-h-screen flex-col pt-24 transition-all duration-500 z-10 ${isSidebarOpen ? 'w-1/3' : 'w-0 px-2'
        } `}
    >
      {isSidebarOpen && <div className='absolute left-8 top-12 font-bold text-3xl z-50'>
        <Link href={`/`}>Notes</Link>
      </div>}
      <Folders />
      <InputNewPage />
      <Slider />
    </div>
  );
}

const Slider = () => {
  const { isSidebarOpen, toggleIsSidebarOpen } = useStateStore();
  return (
    <div
      className='absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 cursor-pointer'
      onClick={() => toggleIsSidebarOpen()}
    >
      <div className='bg-slate-200 rounded-full p-2 w-8 h-8 flex items-center'>
        <Image
          src={'./icons/accordion.svg'}
          height={17}
          width={17}
          alt='accordion'
          className={`transform ${isSidebarOpen ? '-rotate-90' : 'rotate-90'
            } transition-all`}
        />
      </div>
    </div>
  );
};

const Folders = () => {
  const { isSidebarOpen } = useStateStore();
  const { dataFolder, setDataFolder } = useStateStore();

  useEffect(() => {
    const q = query(collection(db, 'folders'));
    onSnapshot(q, (querySnapshot) => {
      let folderData: Folder[] = [];
      querySnapshot.forEach((doc) => {
        let i: Folder = {
          id: doc.id,
          name: '',
          createdAt: {
            seconds: 0,
            nanoseconds: 0
          },
          ...doc.data()
        }
        folderData.push(i);
      });
      console.log('folderData', folderData)
      setDataFolder(folderData);
    });
  }, []);

  return (
    <div className='flex flex-col'>
      {dataFolder?.map((folderItem: Folder, index: number) => (
        <div key={index}>
          {isSidebarOpen && <Folder folderItem={folderItem} />}
        </div>
      ))}
    </div>
  );
};

function Folder({ folderItem }: { folderItem: Folder; }) {
  const [notesInFolder, setNotesInFolder] = useState<Note[]>([]);
  const [isAccordionOpened, setIsAccordionOpened] = useState(false);
  const [isInputOpened, setIsInputOpened] = useState(false);
  const { dataFolder } = useStateStore();

  const fetchNotes = async () => {
    try {
      const q = query(collection(db, "notes"), where("idNote", "==", folderItem.id));
      const querySnapshot = await getDocs(q);
      const notesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: '',
        idNote: '',
        content: '',
        displayTitle: '',
        createdAt: {
          seconds: 0,
          nanoseconds: 0
        },
        subtitle: '',
        ...doc.data()
      }));

      setNotesInFolder(notesList);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };
  useEffect(() => {
    fetchNotes();
  }, [dataFolder])

  return (
    <div
      className={`hover:bg-slate-100 transition-all p-2 rounded-md pr-4 pl-8`}
    >
      <div className='flex justify-between'>
        <div className='opacity-50 font-medium'>{folderItem.name}</div>
        <div className='flex gap-1'>
          <div className='w-4 h-4 relative'
            onClick={() => (document.getElementById(`del_folder` + folderItem.id + folderItem.name) as HTMLDialogElement).showModal()}
          >
            <Image
              src={'./icons/trash.svg'}
              alt='trash'
              className='cursor-pointer'
              fill
            />
          </div>
          <dialog id={`del_folder` + folderItem.id + folderItem.name} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Warning</h3>
              <p className="py-4">Are you sure want to delete <b>{folderItem.name}</b></p>
              <div className="modal-action">
                <form method="dialog">
                  <div className='flex gap-1'>
                    <button className="btn rounded-md btn-outline">
                      Cancel
                    </button>
                    <button className="btn btn-error rounded-md btn-outline"
                      onClick={async () => {
                        const q = query(collection(db, "notes"), where("idNote", "==", folderItem.id));

                        const querySnapshot = await getDocs(q);
                        querySnapshot.forEach((i) => {
                          deleteDoc(doc(db, "notes", i.id));
                        });
                        await deleteDoc(doc(db, 'folders', folderItem.id));
                        setIsAccordionOpened(false)
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
            onClick={() => {
              fetchNotes()
              setIsAccordionOpened(!isAccordionOpened)
            }}
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
      <ContentFolders isAccordionOpened={isAccordionOpened} notesInFolder={notesInFolder} setNotesInFolder={setNotesInFolder} />
      <InputNewFolder isInputOpened={isInputOpened} folderItem={folderItem} setNotesInFolder={setNotesInFolder} />
    </div>
  );
}

const ContentFolders = ({
  isAccordionOpened,
  notesInFolder,
  setNotesInFolder,
}: {
  isAccordionOpened: boolean;
  notesInFolder: Note[];
  setNotesInFolder: any;
}) => {
  const {
    currentNote,
    setCurrentNote,
    setCurrentFolder
  } = useContentStore();
  const [toggleEdit, setToggleEdit] = useState(-1)
  const [inputEditDisplay, setInputEditDisplay] = useState('')

  if (!isAccordionOpened) return <></>;

  const handleClickNote = async (item: Note) => {
    const docRef = doc(db, 'notes', item.id)
    const docSnap = await getDoc(docRef);
    const data = docSnap.data()
    setCurrentNote({
      ...currentNote,
      ...data,
      id: item.id,
    });

    console.log('item', item)

    // get folder by id
    const ref = doc(db, 'folders', item.idNote);
    const docSnapFolder = await getDoc(ref);
    const dataFolder = docSnapFolder.data()
    setCurrentFolder(dataFolder.name);
  }

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteDoc(doc(db, 'notes', notesInFolder[id].id))
    } catch (error) {
      console.log(error)
    }
    setCurrentNote({
      id: '',
      idNote: '',
      displayTitle: '',
      title: '',
      subtitle: '',
      content: '',
      createdAt: {
        seconds: 0,
        nanoseconds: 0
      }
    })
    setNotesInFolder(notesInFolder.filter((item: Note, index: number) => index !== id))
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
      className={`flex flex-col transition-all`}
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

const InputNewFolder = ({
  isInputOpened,
  folderItem,
  setNotesInFolder
}: {
  isInputOpened: boolean
  folderItem: Folder
  setNotesInFolder: any
}) => {
  const [inputFolder, setInputFolder] = useState('');
  const [triggerToast, setTriggerToast] = useState(false)
  const handleNewFolder = () => {
    setInputFolder('');
    addFolder();
  };
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleNewFolder();
    }
  };

  const addFolder = async () => {
    await addDoc(collection(db, "notes"), {
      idNote: folderItem.id,
      displayTitle: inputFolder,
      title: inputFolder,
      subtitle: `subtitle ` + inputFolder,
      content: `content ` + inputFolder,
      createdAt: new Date(),
    });
    const q = query(collection(db, "notes"), where("idNote", "==", folderItem.id));
    const tempArr: Note[] = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let i: Note = {
        id: doc.id,
        title: '',
        idNote: '',
        content: '',
        displayTitle: '',
        createdAt: {
          seconds: 0,
          nanoseconds: 0
        },
        subtitle: '',
        ...doc.data()
      }
      tempArr.push(i)
    });
    setTriggerToast(true)
    setTimeout(() => {
      setTriggerToast(false)
    }, 5000)
    setNotesInFolder(tempArr);
  };



  return <>
    {triggerToast && <div className="toast toast-top toast-center">
      <div className="alert alert-info text-white text-center font-semibold">
        <span>successfully add new folder</span>
      </div>
    </div>}
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
  </>
}

const InputNewPage = () => {
  const { isSidebarOpen, dataFolder, setDataFolder } = useStateStore();
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
    // refresh data
    const q = query(collection(db, 'folders'));
    const querySnapshot = await getDocs(q);
    let folderData: Folder[] = [];
    querySnapshot.forEach((doc) => {
      let i: Folder = {
        id: doc.id,
        name: '',
        createdAt: {
          seconds: 0,
          nanoseconds: 0
        },
        ...doc.data()
      }
      folderData.push(i);
    });
    // setDataFolder(folderData);
  };
  return (
    <div className={`relative mx-8 ${!isSidebarOpen && 'hidden'}`}>
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
