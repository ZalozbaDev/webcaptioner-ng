import { useEffect, useState } from 'react'
import { axiosInstance } from '../../lib/axios'
import { toast } from 'sonner'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Box,
} from '@mui/material'
import { ArrowForward, Download } from '@mui/icons-material'
import { download } from '../../helper/download'

const HistoryScreen = () => {
  const [data, setData] = useState<AudioRecord[]>([])

  const getUsersHistory = async () => {
    axiosInstance
      .get<AudioRecord[]>('/users/audioRecords')
      .then(response => {
        setData(response.data)
      })
      .catch(err => {
        console.error(err)
        toast.error('Zmylk z twojej historiju')
      })
  }

  useEffect(() => {
    getUsersHistory()
  }, [])

  return (
    <div>
      <h1>History</h1>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', paddingInline: 10 }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titul</TableCell>
                <TableCell>Original</TableCell>
                <TableCell>Přełožk</TableCell>
                <TableCell width={200} align='center'>
                  Aktione
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(record => (
                <TableRow
                  key={`${record.createdAt}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {record.title}
                  </TableCell>
                  <TableCell>{record.originalText.at(0) ?? '-'} ...</TableCell>
                  <TableCell>
                    {record.translatedText.at(0) ?? '-'} ...
                  </TableCell>
                  <TableCell
                    style={{
                      display: 'flex',
                      gap: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      variant='outlined'
                      endIcon={<Download />}
                      onClick={() => {
                        download(
                          record.originalText,
                          `${record.title}-original.txt`
                        )
                      }}
                    >
                      original
                    </Button>
                    <Button
                      variant='outlined'
                      endIcon={<Download />}
                      onClick={() => {
                        download(
                          record.translatedText,
                          `${record.title}-prelozk.txt`
                        )
                      }}
                    >
                      Přełožk
                    </Button>
                    <IconButton onClick={() => console.log('detail')}>
                      <ArrowForward />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  )
}

export default HistoryScreen
