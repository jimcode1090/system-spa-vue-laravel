export class User {

    constructor(
        id,
        firstname,
        secondname,
        lastname,
        fullname,
        username,
        email,
        state,
        state_alias,
        profile_image
    )
    {
        this.id = id
        this.firstname = firstname
        this.secondname = secondname
        this.lastname = lastname
        this.fullname = fullname
        this.username = username
        this.email = email
        this.state = state
        this.state_alias = state_alias
        this.profile_image = profile_image
    }

    static fromApi(apiData)
    {
        if(!apiData){
            return new User()
        }
        return new User(
            apiData.id,
            apiData.firstname,
            apiData.secondname,
            apiData.lastname,
            apiData.fullname,
            apiData.username,
            apiData.email,
            apiData.state,
            apiData.state_alias,
            apiData.profile_image
        )
    }
}
