"use client";
import Image from "next/image";
import { useEffect, useState, useLayoutEffect } from "react";
import DeleteIcon, { ThemeIcon } from "./images";
import { toast } from "react-hot-toast";
import { useTheme } from "./theme";
import {
  databases,
  instance,
} from "./auth";
import Modal from "./Modal";
import CreationModal from "./CreationModal";
import { redirect } from "next/navigation";

export default function Home() {
  const [isCreationModalVisible, setIsCreationModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [hasProjects, setHasProjects] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);
  const [deletionId, setDeletionId] = useState("");
  const [deletionName, setDeletionName] = useState("");
  const [isDeletionModalVisible, setIsDeletionModalVisible] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [user, setUser] = useState({});

  const refreshProjects = async () => {
    setIsLoadingProjects(true);
    let d = await databases.listDocuments("public", "projects");
    setProjects(d.documents);
    setHasProjects(d.documents.length > 0);
    setIsLoadingProjects(false);
  };

  const handleDelete = async (id) => {
    setDeletionId(id);
    let proj = await instance.databases.getDocument("public", "projects", id);
    setDeletionName(proj.name);
    setIsDeletionModalVisible(true);
  };

  const creationModalVisible = () => {
    setIsCreationModalVisible(true);
  };
  const creationModalDismiss = () => {
    setIsCreationModalVisible(false);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--modal-background", "#282828");
    document.documentElement.style.setProperty("--toast-text", "#FFFFFF");
  }, []);

  useLayoutEffect(() => {
    setIsLoadingTheme(true);
    !isDarkMode
      ? document.documentElement.classList.remove("dark")
      : document.documentElement.classList.add("dark");
    document.documentElement.style.setProperty(
      "--modal-background",
      isDarkMode ? "#282828" : "#F9F9F9"
    );
    document.documentElement.style.setProperty(
      "--toast-text",
      isDarkMode ? "#FFFFFF" : "#000000"
    );
    setIsLoadingTheme(false);
  }, [isDarkMode]);

  useLayoutEffect(() => {
    async function getSessionDetails() {
      instance.isLoggedIn().then((r) => {
        if (r) {
          refreshProjects();
          function popUlate() {
            instance.accountDetails().then((d) => {
              setUser(d);
            });
          }
          popUlate();
          setLoggedIn(true);
        } else {
          window.location.replace("/login");
          setLoggedIn(false);
          return;
        }
      });
    }
    getSessionDetails();
  }, []);

  if (!isLoggedIn) {
    return null;
  }
  if (isLoadingTheme) {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-3 sm:p-3 font-[family-name:var(--font-geist-sans)] space-y-4">
      {isLoggedIn ? (
        <div className="flex justify-between w-full items-center">
          {isLoadingProjects ? (
            <div
              key={0}
              className="animate-pulse dark:bg-transparent bg-transparent p-4 rounded-lg shadow-md w-full"
            >
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/8 mb-2"></div>
            </div>
          ) : (
            <h2>
              {user.name} - {user.email}{" "}
            </h2>
          )}
          <a
            className="text-blue-500 hover:text-blue-300 hover:cursor-pointer"
            onClick={() => {
              instance.logout();
            }}
          >
            Logout
          </a>
        </div>
      ) : (
        <button
          className="flex items-stretch justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold rounded px-4 py-2 cursor-pointer"
          onClick={() => redirect("/login")}
        >
          Login
        </button>
      )}
      <h1 className="text-3xl mt-5 font-bold text-center text-black dark:text-white">
        Side Project Tracker
      </h1>
      <div className="fixed top-0.5 right-2"></div>
      <div className="flex items-stretch justify-center">
        <button
          className="flex items-stretch justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold rounded px-4 py-2 cursor-pointer"
          onClick={creationModalVisible}
        >
          New Project
          <Image
            src="/add.svg"
            alt="plus"
            width={20}
            height={20}
            className="ml-2"
          />
        </button>
        &nbsp;&nbsp;
        <button
          onClick={toggleDarkMode}
          className="hover:bg-stone-300 text-center dark:hover:bg-slate-700 rounded-md h-[42px] w-[42px] cursor-pointer grid"
        >
          <ThemeIcon
            isDarkMode={isDarkMode}
            className="bg-transparent rounded-md h-[30px] w-[30px] cursor-pointer col-[none] row-[none]"
          />
        </button>
      </div>
      <div className="flex items-stretch space-x-4 w-full">
        <CreationModal
          refreshProjects={refreshProjects}
          onDismiss={creationModalDismiss}
          isModalVisible={isCreationModalVisible}
        />
        <Modal
          title={"Are you sure?"}
          isModalVisible={isDeletionModalVisible}
          onDismiss={() => {
            setIsDeletionModalVisible(false);
          }}
          successLabelClassName="bg-red-500"
          onSuccess={async () => {
            await databases.deleteDocument("public", "projects", deletionId);
            toast.success(`'${deletionName}' deleted successfully!`);
            setDeletionName("");
            setDeletionId("");
            refreshProjects();
            setIsDeletionModalVisible(false);
          }}
          successLabel={"Delete Project"}
        >
          <h3 className="text-xl font-semibold dark:text-white text-black">
            Are you sure you want to delete project &apos;
            {isDeletionModalVisible && deletionName}&apos;.
          </h3>
          <p className="text-sm dark:text-gray-400 text-gray-500">
            This action cannot be undone.
          </p>
        </Modal>
      </div>
      <div className="flex flex-col items-center justify-start w-full max-w-2xl p-4 bg-stone-300 dark:bg-gray-800 rounded-lg shadow-md space-y-4 !h-[63dvh] !overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-4">
          Projects
        </h2>
        <div className="flex flex-col space-y-4 w-full">
          {isLoadingProjects ? (
            <>
              <div
                key={0}
                className="animate-pulse dark:bg-gray-700 bg-white p-4 rounded-lg shadow-md w-full"
              >
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
              </div>
            </>
          ) : (
            <>
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="dark:bg-gray-700 bg-white p-4 rounded-lg shadow-md w-full"
                >
                  <h3 className="text-2xl font-semibold dark:text-white text-black">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 text-xl">{project.description}</p>
                  <button
                    className="del flex items-center justify-center text-red-500 hover:text-red-300 cursor-pointer"
                    onClick={() => handleDelete(project.$id)}
                  >
                    Delete
                    <DeleteIcon
                      width={10}
                      height={10}
                      className="ml-2 fill-red-500 h-10 w-5 hover:fill-red-300"
                    />
                  </button>
                  <p className="text-gray-400 text-[10px]">
                    Project ID: {project.$id}
                  </p>
                </div>
              ))}
              {!hasProjects && (
                <div
                  key={0}
                  className="dark:bg-gray-700 bg-white p-4 rounded-lg shadow-md w-full"
                >
                  <h3 className="text-xl font-semibold dark:text-white text-black">
                    No Projects.
                  </h3>
                  <p className="dark:text-gray-400 text-black">
                    Click &apos;New Project&apos; to create a new project.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}