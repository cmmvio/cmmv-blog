export interface ISettings {
    group: string;
    key: string;
    value: string;
    type: string;
    flags: string[];
}
export interface ISetup {
    admin: {
        email: string;
        password: string;
    };
    blog: {
        title: string;
        description: string;
        url: string;
    };
    settings: {
        postsPerPage: number;
        enableComments: boolean;
        moderateComments: boolean;
        language: string;
        timezone: string;
    };
}
