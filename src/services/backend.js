export default class Backend {
    constructor() {
        this.url = "https://localhost8080/spring_security"
    }

   signIn() {
        return this.url + "/api/v1/auth/signin"
    }
}