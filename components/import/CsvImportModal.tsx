'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { UploadCloud, CheckCircle2, AlertCircle, X, ArrowRight, FileSpreadsheet } from 'lucide-react'
import { Transaction } from '@/lib/types'

interface CsvImportModalProps {
  isOpen: boolean
  onClose: () => void
  currency: string
  onImport: (newTransactions: Omit<Transaction, 'id'>[]) => Promise<void>
}

export function CsvImportModal({ isOpen, onClose, currency, onImport }: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewRows, setPreviewRows] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [columnMap, setColumnMap] = useState<{
    date: string
    merchant: string
    amount: string
    category: string
  }>({
    date: '',
    merchant: '',
    amount: '',
    category: '',
  })
  const [parsedData, setParsedData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a standard .csv file.')
      return
    }

    setError(null)
    setFile(selectedFile)

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setError('The uploaded CSV appears to be empty.')
          return
        }

        const detectedHeaders = results.meta.fields || []
        setHeaders(detectedHeaders)
        setParsedData(results.data)
        setPreviewRows(results.data.slice(0, 5))

        // Auto-detect columns
        const findHeader = (patterns: RegExp[]) => {
          return detectedHeaders.find(h => patterns.some(p => p.test(h.toLowerCase()))) || ''
        }

        const dateCol = findHeader([/date/i, /trans.*date/i, /posted/i, /day/i]) || detectedHeaders[0] || ''
        const merchantCol = findHeader([/merchant/i, /description/i, /payee/i, /name/i, /narrative/i, /title/i]) || detectedHeaders[1] || ''
        const amountCol = findHeader([/amount/i, /total/i, /debit/i, /value/i, /charge/i]) || detectedHeaders[2] || ''
        const categoryCol = findHeader([/category/i, /type/i, /tag/i, /group/i]) || ''

        setColumnMap({
          date: dateCol,
          merchant: merchantCol,
          amount: amountCol,
          category: categoryCol,
        })
      },
      error: (parseError) => {
        setError(parseError.message || 'Error parsing CSV file.')
      },
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const executeImport = async () => {
    if (!parsedData.length) return
    setLoading(true)
    setError(null)

    try {
      const formattedTransactions: Omit<Transaction, 'id'>[] = parsedData.map(row => {
        const rawAmountStr = String(row[columnMap.amount] || '0').replace(/[^0-9.-]+/g, '')
        let parsedAmount = parseFloat(rawAmountStr)
        if (isNaN(parsedAmount)) parsedAmount = 0

        // Format date string to YYYY-MM-DD
        let dateVal = row[columnMap.date] || new Date().toISOString().slice(0, 10)
        const dateObj = new Date(dateVal)
        const validDate = !isNaN(dateObj.getTime()) ? dateObj.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)

        const merchant = String(row[columnMap.merchant] || 'Imported Transaction').trim()
        const category = columnMap.category && row[columnMap.category] ? String(row[columnMap.category]).trim() : 'General'
        const isExpense = parsedAmount <= 0

        return {
          merchant,
          detail: 'CSV Import',
          amount: Math.abs(parsedAmount),
          category,
          date: validDate,
          type: isExpense ? 'expense' : 'income',
        }
      })

      await onImport(formattedTransactions)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to import transactions to Supabase.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#16251f]/40 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl rounded-2xl border border-[#dce4dd] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-[#24463e] text-white">
              <FileSpreadsheet className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1d2d28]">Import Bank Statement CSV</h2>
              <p className="text-xs text-[#718078]">Upload CSV statements from Chase, Wells Fargo, Amex, Stripe, etc.</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#89948d] hover:bg-[#f1f4ef]">
            <X className="size-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#b9cdbd] bg-[#f8fbf7] p-8 text-center transition hover:border-[#24463e] hover:bg-[#f0f7f1]"
          >
            <div className="grid size-12 place-items-center rounded-2xl bg-[#e3efe4] text-[#24463e]">
              <UploadCloud className="size-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#1d2d28]">Drag and drop your bank CSV statement here</p>
            <p className="mt-1 text-xs text-[#718078]">Supports Chase, Bank of America, Amex, Apple Card, or any standard CSV</p>
            
            <label className="mt-4 cursor-pointer rounded-xl bg-[#24463e] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630]">
              Browse file
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />
            </label>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-xl bg-[#f4f7f2] p-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#24463e]" />
                <span className="font-semibold text-[#1d2d28]">{file.name}</span>
                <span className="text-[#718078]">({parsedData.length} records detected)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null)
                  setParsedData([])
                  setPreviewRows([])
                }}
                className="text-[11px] font-semibold text-[#24463e] underline"
              >
                Choose another file
              </button>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold text-[#31443b]">Confirm Column Mapping</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#718078]">Date Column</label>
                  <select
                    value={columnMap.date}
                    onChange={e => setColumnMap({ ...columnMap, date: e.target.value })}
                    className="w-full rounded-xl border border-[#d6dfd7] bg-white p-2 text-xs text-[#1d2d28]"
                  >
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#718078]">Merchant / Description</label>
                  <select
                    value={columnMap.merchant}
                    onChange={e => setColumnMap({ ...columnMap, merchant: e.target.value })}
                    className="w-full rounded-xl border border-[#d6dfd7] bg-white p-2 text-xs text-[#1d2d28]"
                  >
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#718078]">Amount Column</label>
                  <select
                    value={columnMap.amount}
                    onChange={e => setColumnMap({ ...columnMap, amount: e.target.value })}
                    className="w-full rounded-xl border border-[#d6dfd7] bg-white p-2 text-xs text-[#1d2d28]"
                  >
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#718078]">Category (Optional)</label>
                  <select
                    value={columnMap.category}
                    onChange={e => setColumnMap({ ...columnMap, category: e.target.value })}
                    className="w-full rounded-xl border border-[#d6dfd7] bg-white p-2 text-xs text-[#1d2d28]"
                  >
                    <option value="">None (Auto-classify)</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold text-[#31443b]">Preview (First 5 Rows)</h3>
              <div className="overflow-x-auto rounded-xl border border-[#e5e8e0]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#e5e8e0] bg-[#fafbf9] text-[11px] font-semibold text-[#718078]">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Merchant</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2ee]">
                    {previewRows.map((row, i) => (
                      <tr key={i} className="hover:bg-[#f9faf7]">
                        <td className="p-2.5 text-[#637269]">{row[columnMap.date] || '-'}</td>
                        <td className="p-2.5 font-medium text-[#1d2d28]">{row[columnMap.merchant] || '-'}</td>
                        <td className="p-2.5 text-[#637269]">{columnMap.category ? (row[columnMap.category] || 'General') : 'General'}</td>
                        <td className="p-2.5 text-right font-semibold text-[#1d2d28]">
                          {currency}{row[columnMap.amount] || '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-[#edf0eb] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#718078] hover:bg-[#f1f4ef]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={executeImport}
                className="inline-flex items-center gap-2 rounded-xl bg-[#24463e] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b3630] disabled:opacity-50"
              >
                {loading ? 'Importing…' : `Import ${parsedData.length} Transactions`}
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
