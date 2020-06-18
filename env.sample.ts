export = {
    env: 'development',
    type: 'mysql', // mysql or postgres
    host: "localhost",
    hostaddr: "127.0.0.1",
    port: "3306", // 3306 default mysql or "5432" default for postgres
    database: "npress",
    username: "",
    password: "",
    synchronize: false,
    logging: false,
    disableLogin: 0 // wil work only if env=development too
}