"use client";
import { useParams } from "next/navigation";
import { instance } from "@/app/auth";
import { useEffect, useState } from "react";
import { ID, Permission, Role} from "appwrite";
import DeleteIcon from "@/app/images"
import toast from "react-hot-toast";

export default function Page() {
  const { id } = useParams();
  const [project, setProject] = useState({name:"",description:"",notes: []})
  const [note, setNote] = useState("")
  const [hasNotes, setHasNotes] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const refreshNotes = async () => {
    setIsLoading(true)
    let proj = await instance.databases.getDocument(
        "public",
        "projects",
        id
      );
    setProject(proj)
    setHasNotes(proj.notes.length > 0)
    setIsLoading(false)
  }

  const handleCreate = async () => {
    if(note.trim() == '') {
      toast.error("Note field empty.")
      return;
    }
    
    let a = await instance.accountDetails()

    await instance.databases.createDocument(
        "public",
        "6843a7770017b083d3d3", //notes collection,
        ID.unique(),
        {
          text: note,
          project: project.$id
        },
        [
          Permission.read(Role.user(a.$id)),
          Permission.update(Role.user(a.$id)),
          Permission.delete(Role.user(a.$id))
        ]

    )
    toast.success("Note created.")
    setNote("")

    refreshNotes();
  }

  const handleDelete = async (id) => {
    await instance.databases.deleteDocument(
      "public",
      "6843a7770017b083d3d3", //notes collection
      id
    )
    toast.success("Note deleted.")
    refreshNotes()
  }

  useEffect(()=>{
    async function getProject(){
      //let a = await instance.account.get()

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
        {project.notes.map((note, index) => (
        <div
          key={index}
          className="dark:bg-gray-700 bg-white p-4 rounded-lg shadow-md w-full flex items-center"
        >
          <div className="flex-1">
            <h3 className="text-2xl font-semibold dark:text-white text-black">
              {note.text}
            </h3>
            <p className="text-gray-400 text-[10px]">
              Note ID: {note.$id}
            </p>
          </div>
          <button
            className="ml-2 p-1 h-[calc(100%-0.5rem)] flex items-center justify-center rounded hover:bg-red-100 dark:hover:bg-gray-600 hover:cursor-pointer"
            style={{ alignSelf: "stretch" }}
            onClick={() => handleDelete(note.$id)} // Uncomment and implement if needed
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