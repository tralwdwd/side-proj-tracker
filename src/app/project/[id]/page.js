"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { data } from "@/app/apiclient";

export default function ProjectPage() {
  const { id } = useParams()
  const pathname = usePathname();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("not_started");

  const updateDetails = async () => {
    data.updateProject(id, {
            name,
            description,
            status
        })
    toast.success("Project Saved.")
  } 

  useEffect(()=>{
    async function init(){
        let proj = await data.getProjectDetails(id)
        setName(proj.name)
        setDescription(proj.description)
        setStatus(proj.status)
        }
        init()
  }, [])

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-[var(--modal-background)] rounded-lg shadow-md p-6 mt-8">
        <h1 className="text-3xl font-bold text-center text-black dark:text-white mb-6">
          Project Details
        </h1>
        <div className="mb-4">
          <label className="block text-lg font-semibold text-black dark:text-white mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full h-10 px-2 rounded-md dark:bg-gray-700 bg-neutral-300 dark:text-white"
            placeholder="Project Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-semibold text-black dark:text-white mb-1">
            Description
          </label>
          <textarea
            className="w-full h-20 px-2 py-1 rounded-md dark:bg-gray-700 bg-neutral-300 dark:text-white"
            placeholder="Project Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-semibold text-black dark:text-white mb-1">
            Status
          </label>
          <select
            className="w-full h-10 px-2 rounded-md dark:bg-gray-700 bg-neutral-300 dark:text-white"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="progress">In Progress</option>
            <option value="not_started">Not Started</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer"
            onClick={updateDetails}
          >
            Save
          </button>
        </div>
        <div className="w-full max-w-2xl flex justify-end mt-4">
        <Link
          href={`${pathname}/notes`}
          className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-black dark:text-white font-bold py-2 px-4 rounded"
        >
          Go to Notes
        </Link>
      </div>
      </div>
      
    </div>
  );
}