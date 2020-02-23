declare const knexfile: {
    testing: {
        client: string;
        connection: {
            host: any;
            port: any;
            user: any;
            password: any;
            database: any;
        };
        migrations: {
            directory: any;
            disableMigrationsListValidation: boolean;
        };
        seeds: {
            directory: any;
        };
    };
    development: {
        client: string;
        connection: {
            host: any;
            port: any;
            user: any;
            password: any;
            database: any;
        };
        migrations: {
            directory: any;
            disableMigrationsListValidation: boolean;
        };
        seeds: {
            directory: any;
        };
    };
    production: {
        client: string;
        connection: {
            host: any;
            port: any;
            user: any;
            password: any;
            database: any;
        };
        migrations: {
            directory: any;
            disableMigrationsListValidation: boolean;
        };
        seeds: {
            directory: any;
        };
    };
};
export default knexfile;
