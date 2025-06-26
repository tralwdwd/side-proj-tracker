const baseUrl = "/api/v1"; // Since Next.js API routes are same-origin

const request = async (url, method = "GET", body = null) => {
    const options = {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${baseUrl}${url}`, options);
    const json = await res.json();
    const status = res.status
    return {json, status};
};

const auth = {
    signUp: async (email, username, password, redirect = true) => {
        const {res, status} = await request("/auth/signup", "POST", {
            email,
            username,
            password,
        });
        if (status === 200 && redirect) window.location.href = "/";
        return res;
    },

    login: async (email, password, redirect = true) => {
        const {res, status} = await request("/auth/login", "POST", {
            email,
            password,
        });
        if (status === 200 && redirect) window.location.href = "/";
        return res;
    },

    logout: async (redirect = true) => {
        const {res} = await request("/auth/logout");
        if (redirect) window.location.href = "/login";
        return res;
    },

    isLoggedIn: async () => {
        const {status} = await request("/auth/current");
        return status === 200;
    },

    currentUser: async () => {
        const {json} = await request("/auth/current");
        return json.user;
    },
};

const data = {
    getProjectList: async () => {
        const {json} = await request("/projects/list");
        return json.projects;
    },

    getProjectDetails: async (uuid) => {
        return (await request(`/projects/get/${uuid}`)).json.project;
    },

    newProject: async (name, description) => {
        return await request("/projects/new", "POST", { name, description }).json;
    },

    updateProject: async (uuid, updatedData) => {
        return await request(`/projects/update/${uuid}`, "POST", updatedData).json;
    },

    deleteProject: async (uuid) => {
        return (await request(`/projects/delete/${uuid}`, "DELETE")).json;
    },

    getNoteList: async (projectUUID) => {
        const {json} = await request(`/notes/${projectUUID}/list`);
        return json.notes;
    },

    newNote: async (content, project_uuid) => {
        return (await request(`/notes/${project_uuid}/new`, "POST", { content }));
    },

    deleteNote: async (uuid, project_uuid) => {
        return await request(`/notes/${project_uuid}/delete/${uuid}`, "DELETE");
    },
};

export { auth, data };
