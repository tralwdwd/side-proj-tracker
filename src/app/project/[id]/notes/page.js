"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteIcon from "@/app/images"
import toast from "react-hot-toast";
import { data } from "@/app/apiclient";

export default function Page() {
  const { id } = useParams();
  const [notes, setNotes] = useState({content:"", ID: 0})
  const [note, setNote] = useState("")
  const [hasNotes, setHasNotes] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const refreshNotes = async () => {
    setIsLoading(true)
    let notes = await data.getNoteList(id)
    setNotes(notes)
    setHasNotes(notes.length > 0)
    setIsLoading(false)
  }

  const handleCreate = async () => {
    if(note.trim() == '') {
      toast.error("Note field empty.")
      return;
    }
    
    await data.newNote(note, id)
    toast.success("Note created.")
    setNote("")

    refreshNotes();
  }

  const handleDelete = async (id) => {
    await data.deleteNote(id)
    toast.success("Note deleted.")
    refreshNotes()
  }

  useEffect(()=>{
    async function getProject(){

      refreshNotes()


      
    }
    getProject()
  }, [])

  
  return (
    <div className="flex flex-col items-center min-h-screen p-3 sm:p-3 font-[family-name:var(--font-geist-sans)] space-y-4">
  <div className="flex flex-col items-center justify-start w-full max-w-2xl p-4 bg-stone-300 dark:bg-gray-800 rounded-lg shadow-md space-y-4 !h-[63dvh] !overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-4">
          Notes
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
  <input
    type="text"
    className="flex-1 min-h-10 h-10 px-2 rounded-md dark:bg-gray-700 bg-neutral-200 dark:text-white"
    placeholder="Note"
    value={note}
    onChange={(n) => setNote(n.target.value)}
  />
  <button
    type="button"
    className="h-10 rounded-md bg-blue-500 text-white font-medium cursor-pointer px-4"
    onClick={handleCreate}
  >
    Create Note
  </button>
</div>
    <div className="flex flex-col space-y-4 w-full">
      {!isLoading ?
      <>
      {hasNotes ?
      <>
        {notes.map((note, index) => (
        <div
          key={index}
          className="dark:bg-gray-700 bg-white p-4 rounded-lg shadow-md w-full flex items-center"
        >
          <div className="flex-1">
            <h3 className="text-2xl font-semibold dark:text-white text-black">
              {note.content}
            </h3>
            <p className="text-gray-400 text-[10px]">
              Note ID: {note.id}
            </p>
          </div>
          <button
            className="ml-2 p-1 h-[calc(100%-0.5rem)] flex items-center justify-center rounded hover:bg-red-100 dark:hover:bg-gray-600 hover:cursor-pointer"
            style={{ alignSelf: "stretch" }}
            onClick={() => handleDelete(note.uuid)} // Uncomment and implement if needed
          >
            <DeleteIcon
              width={24}
              height={24}
              className="fill-red-500 hover:fill-red-300"
            />
          </button>
        </div>
        ))}
        </>
        :
        <>
           <div
          key={0}
          className="dark:bg-gray-700 bg-white p-4 rounded-lg shadow-md w-full flex items-center"
        >
          <div className="flex-1">
            <h3 className="text-2xl font-semibold dark:text-white text-black">
              No notes.
            </h3>
          </div>
        </div>
        </>
        }
        </>
      :
        <>
              <div
                key={0}
                className="animate-pulse dark:bg-gray-700 bg-white p-4 rounded-lg shadow-md w-full"
              >
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
              </div>
            </>
      }
    
  </div>
  </div>
  </div>
  );
}