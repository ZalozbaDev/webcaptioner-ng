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
  Typography,
  Stack,
  Tooltip,
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

const getPreviewText = (lines: AudioRecord['originalText']) => {
  const firstLine = lines.at(0)

  if (!firstLine) return '-'

  return `${getTranscriptLinePlain(firstLine)} ...`
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

      setData(prev => prev.filter(record => record._id !== recordId))
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
        return
      }

      setData(payload.items)
      setTotal(payload.total)
      setPage(payload.page)
      setRowsPerPage(payload.limit)
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

  const downloadButtonSx = {
    minWidth: 'auto',
    px: 1,
    py: 0.4,
    color: 'text.primary',
    borderColor: 'divider',
    textTransform: 'none',
    fontWeight: 400,
    fontSize: '0.8rem',
    lineHeight: 1.4,

    '& .MuiButton-endIcon': {
      ml: 0.5,
      mr: 0,
      color: 'inherit',
    },

    '& .MuiButton-endIcon svg': {
      color: 'inherit',
      fill: 'currentColor',
      fontSize: 18,
    },

    '&:hover': {
      borderColor: 'text.primary',
      bgcolor: 'action.hover',
    },
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        px: {
          xs: 2,
          sm: 4,
          md: 10,
        },
        py: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      <h2>Historia</h2>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto',
          bgcolor: 'background.paper',
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Table
          sx={{
            minWidth: 900,
            '& th': {
              color: 'text.primary',
              fontWeight: 600,
              bgcolor: 'background.default',
              borderColor: 'divider',
            },
            '& td': {
              color: 'text.primary',
              borderColor: 'divider',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Titul</TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Original</TableCell>
              <TableCell>Přełožk</TableCell>
              <TableCell width={230} align='center'>
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
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  <Typography variant='body2' color='text.secondary'>
                    Žane zapiski namakane
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map(record => (
                <TableRow
                  key={record._id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component='th' scope='row'>
                    <Typography
                      variant='body2'
                      sx={{
                        maxWidth: 180,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={record.title}
                    >
                      {record.title}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {record.createdAt
                      ? new Date(record.createdAt).toLocaleString()
                      : '-'}
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant='body2'
                      sx={{
                        maxWidth: 220,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={getPreviewText(record.originalText)}
                    >
                      {getPreviewText(record.originalText)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant='body2'
                      sx={{
                        maxWidth: 220,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={getPreviewText(record.translatedText)}
                    >
                      {getPreviewText(record.translatedText)}
                    </Typography>
                  </TableCell>

                  <TableCell align='center'>
                    <Stack
                      direction='row'
                      spacing={0.35}
                      alignItems='center'
                      justifyContent='center'
                      sx={{
                        flexWrap: 'nowrap',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Button
                        variant='outlined'
                        size='small'
                        endIcon={<Download />}
                        onClick={() => {
                          download(
                            record.originalText.map(getTranscriptLinePlain),
                            `${record.title}-original.txt`,
                          )
                        }}
                        sx={downloadButtonSx}
                      >
                        original
                      </Button>

                      <Button
                        variant='outlined'
                        size='small'
                        endIcon={<Download />}
                        onClick={() => {
                          download(
                            record.translatedText.map(getTranscriptLinePlain),
                            `${record.title}-prelozk.txt`,
                          )
                        }}
                        sx={downloadButtonSx}
                      >
                        Přełožk
                      </Button>

                      <Tooltip title='Zhašeć'>
                        <IconButton
                          size='small'
                          aria-label='delete record'
                          disabled={isDeleting}
                          onClick={() => setRecordToDelete(record)}
                          sx={{
                            p: 0.5,
                            color: 'error.main',

                            '& > .MuiSvgIcon-root': {
                              color: 'inherit !important',
                              fill: 'currentColor',
                            },

                            '&.Mui-disabled': {
                              color: 'action.disabled',
                            },

                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Stack>
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
          sx={{
            color: 'text.primary',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        />
      </TableContainer>

      <Dialog
        open={Boolean(recordToDelete)}
        onClose={() => {
          if (!isDeleting) setRecordToDelete(null)
        }}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
          },
        }}
      >
        <DialogTitle>Zapisk zhašeć?</DialogTitle>

        <DialogContent>
          <DialogContentText color='text.secondary'>
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
    </Box>
  )
}

export default HistoryScreen
