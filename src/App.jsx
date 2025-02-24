import { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'

const API_BASE_URL = 'https://api.themoviedb.org/3/'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers:{
    accept: 'application/json',
    authorization:`Bearer ${API_KEY}`
  }
}
function App() {
  const [searchTerm, setsearchTerm] = useState('')
  const [movieList, setmovieList] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

const fetchMovies = async (query='') => {

  setisLoading(true)
  setErrorMessage('')
  try {
    const endpoint =
    
    query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await fetch(endpoint, API_OPTIONS)
    console.log(response)
    if (!response.ok) {
      throw new Error('Failed to load movies')
    } else {
      const data = await response.json()
       if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setmovieList([])
        return;
      }
      setmovieList(data.results || [])
    }
  } catch (error) {
    console.error(`Error fetching movies: ${error}`)
    setErrorMessage('Error fecthing movies. Please try again later.');
  } finally {
    setisLoading(false)
  }
}

useEffect(() => {
fetchMovies(searchTerm)
},[searchTerm])


  return (
    <main>
      <div className='pattern' />

        <div className="wrapper">
          <header>
            <img src="./hero.png" alt='Hero Banner' />
            <h1>
              Find <span className="text-gradient"> Movies</span>
                You &apos;ll Enjoy
            </h1>
          </header>
            <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
         <section className='all-movies'>
            <h2 className='mt-[40px]'>All Movies</h2>
           {
            isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )
           }
         </section>
        </div>
    </main>
  )
}

export default App
