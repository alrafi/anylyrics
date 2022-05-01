// import type { NextPage } from 'next'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'

const Songs = () => {
  const [searchResult, setSearchResult] = useState([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const host = process.env.RAPIDAPI_HOST || ''
  const key = process.env.RAPIDAPI_KEY || ''

  const options = {
    method: 'GET',
    url: 'https://genius-song-lyrics1.p.rapidapi.com/search',
    headers: {
      'X-RapidAPI-Host': host,
      'X-RapidAPI-Key': key,
    },
    params: {
      q: query,
    },
  }

  const handleChangeQuery = (q: string) => {
    setQuery(q)
  }

  const router = useRouter()

  useEffect(() => {
    if (router.query.search) {
      setIsLoading(true)
      setSearchResult([])
      axios
        .get('https://genius-song-lyrics1.p.rapidapi.com/search', {
          headers: {
            'X-RapidAPI-Host': host,
            'X-RapidAPI-Key': key,
          },
          params: {
            q: router.query.search,
          },
        })
        .then(function (response) {
          setIsLoading(false)

          setSearchResult(response.data.response.hits)
        })
        .catch(function (error) {
          setIsLoading(false)
          console.error(error)
        })
    }
  }, [router.query.search])

  const submitSearch = (e: any) => {
    e.preventDefault()

    router.replace({
      href: '/',
      query: {
        search: query,
      },
    })

    setIsLoading(true)
    setSearchResult([])
    axios
      .request(options)
      .then(function (response) {
        setIsLoading(false)

        setSearchResult(response.data.response.hits)
      })
      .catch(function (error) {
        setIsLoading(false)
        console.error(error)
      })
  }

  return (
    <Box className="flex flex-col items-center p-8">
      <h1 className="mb-8 text-4xl">Search any song lyrics...</h1>

      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={submitSearch}
      >
        <TextField
          id="outlined-basic"
          placeholder="Search..."
          variant="outlined"
          value={query}
          onChange={(e) => handleChangeQuery(e.target.value)}
        />
      </Box>

      {isLoading && (
        <Box className="mt-8 flex justify-center">
          <CircularProgress />
        </Box>
      )}

      {searchResult.length > 0 && (
        <Box className="self-start">
          <h2 className="mb-4 text-xl font-semibold">
            Search result for '{router.query.search}'
          </h2>

          {searchResult.length > 0 &&
            searchResult.map((item: any) => {
              return (
                <Link href={`/song/${item.result.id}`} key={item.result.id}>
                  <Box className="mb-4 flex cursor-pointer">
                    <img
                      src={item.result.header_image_thumbnail_url}
                      alt=""
                      className="mr-4 h-16 w-16 rounded-md"
                    />
                    <Box>
                      <p className="text-lg font-medium">{item.result.title}</p>
                      <p className="text-gray-400">
                        {item.result.artist_names}
                      </p>
                    </Box>
                  </Box>
                </Link>
              )
            })}
        </Box>
      )}
    </Box>
  )
}

export default Songs
