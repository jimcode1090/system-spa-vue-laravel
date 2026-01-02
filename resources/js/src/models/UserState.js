

export class UserState {
    constructor(value, label) {
        this.value = value
        this.label = label
    }

    static fromJSON(json)
    {
        return new UserState(json.value, json.label)
    }
}
