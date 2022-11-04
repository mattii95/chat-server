class UserModel {
    constructor(name, email, password, online = false) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.online = online;
    }
}

module.exports = UserModel;