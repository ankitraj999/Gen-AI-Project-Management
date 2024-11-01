"use client"

import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function SRSDocument() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [modifiedFile, setModifiedFile] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.5)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setOriginalFile(event.target.files[0])
      setModifiedFile(null)
      setPageNumber(1)
      setError(null)
    }
  }, [])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }, [])

  const processFile = useCallback(async () => {
    if (!originalFile) return

    const formData = new FormData()
    formData.append('file', originalFile)

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('https://1052-134-139-34-35.ngrok-free.app/api/srs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      })

      const modifiedPdfBlob = new Blob([response.data], { type: 'application/pdf' })
      setModifiedFile(URL.createObjectURL(modifiedPdfBlob))
    } catch (error) {
      setError('Error processing file. Please try again.')
      console.error('Error processing file:', error)
    } finally {
      setLoading(false)
    }
  }, [originalFile])

  const changePage = useCallback((offset: number) => {
    setPageNumber(prevPageNumber => Math.max(1, Math.min(prevPageNumber + offset, numPages)))
  }, [numPages])

  const previousPage = useCallback(() => changePage(-1), [changePage])
  const nextPage = useCallback(() => changePage(1), [changePage])

  const zoomIn = useCallback(() => setScale(prevScale => Math.min(prevScale + 0.2, 3)), [])
  const zoomOut = useCallback(() => setScale(prevScale => Math.max(prevScale - 0.2, 0.5)), [])

  const renderPdfFile = useCallback((file: File | string | null) => {
    if (!file) return null

    return (
      <>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
        </Document>
        <div className="flex items-center justify-center mt-4 space-x-2">
          <Button onClick={previousPage} disabled={pageNumber <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-sm">
            Page {pageNumber} of {numPages}
          </p>
          <Button onClick={nextPage} disabled={pageNumber >= numPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </>
    )
  }, [pageNumber, scale, onDocumentLoadSuccess, previousPage, nextPage, zoomOut, zoomIn, numPages])

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 w-full max-w-2xl mx-auto">
        <div className="flex-grow">
          <Input 
            type="file" 
            accept=".pdf" 
            onChange={onFileChange} 
            className="w-full p-2 border-2 border-blue-500 rounded-lg hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex-shrink-0">
          <Button 
            className="font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 whitespace-nowrap"
            onClick={processFile} 
            disabled={!originalFile || loading}
          >
            {loading ? 'Processing...' : 'Process PDF'}
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex space-x-4">
        <Card className="flex-1">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Original PDF</h3>
            {renderPdfFile(originalFile)}
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Modified PDF</h3>
            {renderPdfFile(modifiedFile)}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}