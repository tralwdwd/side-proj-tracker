import { Account, Client, Databases, ID } from "appwrite";
import { redirect } from "next/navigation";

export const appClient = new Client().setEndpoint("https://api.tralwdwd.xyz/v1").setProject("6838ac5a0001d4c614a6")

export const account = new Account(appClient)

export const databases = new Databases(appClient)

class AppWriterInstance {
    constructor () {
        this.client = new Client().setEndpoint("https://api.tralwdwd.xyz/v1").setProject("6838ac5a0001d4c614a6")
        this.account = new Account(this.client)
        this.databases = new Databases(this.client)
    }

    async login(email, password) {
        let isError = false
        let error = {}
        await this.account.createEmailPasswordSession(
            email,
            password
        )
        .catch(
            (r) => {
                isError = true
                switch (r.type){
                    case "user_invalid_credentials":
                        error =  {code: 401, message:"Invalid credentials."}
                    default:
                        error =  {code: r.code, message: r.message}
                }
            }
        )
        let ret = isError ? error : window.location.replace("/")
        return ret
    }
    async signup(email, username, password) {
        await this.account.create(
            ID.unique(),
            email,
            password,
            username
        )
        .catch(
            (r) => {
                switch (r.type) {
                    case "user_already_exists":
                        return {code: 409, message: "A user with this email already exists."};
                    default:
                        return {code: r.code, message: r.type}
                }
            }
        )

        this.login(email, password)
        return null
    }
    async logout() {
        await this.account.deleteSession("current")
        .catch((r) =>{
            return {code: r.code, message: r.type}
        })

        redirect("/login")
    }

    async isLoggedIn() {
        let result;
        await this.account.get()
        .catch((_) => {
            result = false
        })
        return result == false ? result : true
    }

    async accountDetails() {
        let u = await this.account.get()
        return u
    }
}

export const instance = new AppWriterInstance()
