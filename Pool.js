const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();

const devConfig = {
    user:process.env.DBUSERNAME,
    password:process.env.DBPASSWORD,
    host:process.env.DBHOST,
    port:process.env.DBPORT,
    database:process.env.DB    
}

const proConfig = {
    connectionString:process.env.DATABASE_URL
}
const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);

module.exports = pool;