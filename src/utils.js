const parseUsers = (data) => {
    return data.map(item => {
        const {fields: {Id, Name, avatar, occupation}} = item ?? {};

        return {
            Id,
            Name,
            avatar,
            occupation
        }
    });
};

export {
    parseUsers
}