import dotenv from "dotenv";
dotenv.config();
function middleware(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    next();
}
export default middleware;