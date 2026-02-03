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
  TablePagination,
} from '@mui/material'
import { ArrowForward, Delete, Download } from '@mui/icons-material'
import { download } from '../../helper/download'
import { getTranscriptLinePlain } from '../../types/transcript'

type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  limit: number
}

const HistoryScreen = () => {
  const [data, setData] = useState<AudioRecord[]>([])
  const [recordToDelete, setRecordToDelete] = useState<AudioRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)

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
    await getUsersHistory(page, rowsPerPage)
  }

  const getUsersHistory = async (nextPage = page, nextLimit = rowsPerPage) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get<
        AudioRecord[] | PaginatedResponse<AudioRecord>
      >('/users/audioRecords', {
        params: {
          page: nextPage,
          limit: nextLimit,
        },
      })

      const payload = response.data
      if (Array.isArray(payload)) {
        setData(payload)
        setTotal(payload.length)
        setPage(0)
      } else {
        setData(payload.items)
        setTotal(payload.total)
        setPage(payload.page)
        setRowsPerPage(payload.limit)
      }
    } catch (err) {
      console.error(err)
      toast.error('Zmylk z twojej historiju')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUsersHistory(page, rowsPerPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage])

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
                <TableCell>Datum</TableCell>
                <TableCell>Original</TableCell>
                <TableCell>Přełožk</TableCell>
                <TableCell width={200} align='center'>
                  Aktione
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    <CircularProgress size={20} />
                  </TableCell>
                </TableRow>
              ) : (
                data.map(record => (
                  <TableRow
                    key={record._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      {record.title}
                    </TableCell>
                    <TableCell>
                      {record.createdAt
                        ? new Date(record.createdAt).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {record.originalText.at(0)
                        ? getTranscriptLinePlain(record.originalText.at(0)!)
                        : '-'}{' '}
                      ...
                    </TableCell>
                    <TableCell>
                      {record.translatedText.at(0)
                        ? getTranscriptLinePlain(record.translatedText.at(0)!)
                        : '-'}{' '}
                      ...
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
                            record.originalText.map(getTranscriptLinePlain),
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
                            record.translatedText.map(getTranscriptLinePlain),
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
                ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            component='div'
            count={total}
            page={page}
            onPageChange={(_, nextPage) => setPage(nextPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={event => {
              const next = Number.parseInt(event.target.value, 10)
              setRowsPerPage(next)
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
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
