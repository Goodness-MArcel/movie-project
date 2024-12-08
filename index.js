import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
// Load environment variables
dotenv.config({ path: './app.env' });

const apiKey = process.env.TMDb_API_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// Update your Express app configuration to set the correct views directory:
app.set('views', path.join(__dirname, 'public', 'views'));

const PORT = 3000;
const HOSTNAME = `127.0.0.5`;

app.get("/",(req , res)=>{
    res.render(
        "index.ejs"
    )
    
});

app.get("/movieDescription/:id", async (req,res)=>{
    const movieId = req.params.id;
    console.log(movieId)
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    // res.send('movieDescription')
    try{
        const response = await  axios.get(url);
        const movie = response.data;
        res.render(
             "moviePage.ejs",
            {
                data: movie
            }
        )
    }catch(error){
        console.log("Error trying to load movie:",error);
        // res.render("moviePage.ejs",
        //     {data: "Failed to make request"}
        // )
        res.status(500).send('something went wrong')
    }
    
});

app.post("/show_movie", async (req,res)=>{
    let query = req.body['search'];
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
    // res.send("we got you");
    try{
        const response = await axios.get(url);
        const results = response.data ;
        console.log(results)
        res.render(
             "searchedMovie.ejs",
           {
            movie: results,
            x: query
        });
             
     
    }catch(error){
        console.error("Error:", error.message);
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          res.status(503).send("Network error. Please check your internet connection.");
        } else {
          res.status(500).send("Something went wrong.");
        }
    }
})

// Route to display action movies poster

app.listen(PORT , HOSTNAME , ()=>{
    console.log(`server running on port http://${HOSTNAME}:${PORT}`);
});

