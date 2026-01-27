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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import { ArrowForward, Delete, Download } from '@mui/icons-material'
import { download } from '../../helper/download'

const HistoryScreen = () => {
  const [data, setData] = useState<AudioRecord[]>([])
  const [recordToDelete, setRecordToDelete] = useState<AudioRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteRecord = async (recordId: string) => {
    try {
      setIsDeleting(true)
      await axiosInstance.delete(`/users/audioRecords/${recordId}`)
      setData(prev => prev.filter(r => r._id !== recordId))
      toast.success('Zapisk je zhašeny')
    } catch (err) {
      console.error(err)
      toast.error('Zmylk při zhašenju zapiska')
    } finally {
      setIsDeleting(false)
      setRecordToDelete(null)
    }
  }

  const onConfirmDelete = async () => {
    if (!recordToDelete) return
    await deleteRecord(recordToDelete._id)
  }

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
                  key={record._id}
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
                          `${record.title}-original.txt`,
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
                          `${record.title}-prelozk.txt`,
                        )
                      }}
                    >
                      Přełožk
                    </Button>
                    <IconButton onClick={() => console.log('detail')}>
                      <ArrowForward />
                    </IconButton>
                    <IconButton
                      color='error'
                      aria-label='delete record'
                      disabled={isDeleting}
                      onClick={() => setRecordToDelete(record)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={Boolean(recordToDelete)}
        onClose={() => {
          if (!isDeleting) setRecordToDelete(null)
        }}
      >
        <DialogTitle>Zapisk zhašeć?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Chceš tutu zapisk woprawdźe zhašeć?
            {recordToDelete?.title ? ` ("${recordToDelete.title}")` : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={isDeleting} onClick={() => setRecordToDelete(null)}>
            Přetorhnyć
          </Button>
          <Button
            color='error'
            variant='contained'
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : <Delete />}
            onClick={onConfirmDelete}
          >
            Zhašeć
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default HistoryScreen
