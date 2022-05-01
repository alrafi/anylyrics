// import type { NextPage } from 'next'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'

interface Song {
  tracking_data: TrackingData
  lyrics: any
}

interface TrackingData {
  title: string
  primary_artist: string
}

const Song = () => {
  const [song, setSong] = useState<Partial<Song>>({})
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const router = useRouter()
  const { id } = router.query

  const host = process.env.RAPIDAPI_HOST || ''
  const key = process.env.RAPIDAPI_KEY || ''

  const options = {
    method: 'GET',
    url: `https://genius-song-lyrics1.p.rapidapi.com/songs/${id}/lyrics`,
    headers: {
      'X-RapidAPI-Host': host,
      'X-RapidAPI-Key': key,
    },
  }

  useEffect(() => {
    if (id) {
      axios
        .request(options)
        .then(function (response) {
          setLoaded(true)

          if (response.data.meta.status === 200) {
            setSong(response.data?.response?.lyrics)
          } else {
            setError(true)
          }
        })
        .catch(function (error) {
          console.error(error)
          setLoaded(true)
          setError(true)
        })
    }
  }, [id])

  if (!loaded)
    return (
      <Box className="flex h-screen items-center justify-center">
        <CircularProgress />
      </Box>
    )

  return (
    <Box className="flex flex-col items-center p-8">
      {song && (
        <Box className="flex flex-col items-center">
          <h1 className="mb-2 text-3xl">{song?.tracking_data?.title}</h1>
          <h2 className="mb-16">{song?.tracking_data?.primary_artist}</h2>

          <div dangerouslySetInnerHTML={{ __html: song?.lyrics?.body?.html }} />
        </Box>
      )}

      {error && <h2>Sorry, lyric not found :(</h2>}
    </Box>
  )
}

export default Song
