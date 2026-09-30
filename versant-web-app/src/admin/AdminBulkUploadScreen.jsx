import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const COLUMNS = [
  'Student ID',
  'First Name',
  'Last Name',
  'Email',
  'Department',
  'Batch',
  'Status',
]

const RULES = [
  'Student IDs must be unique.',
  'Email addresses must be valid and unique.',
  'Do not leave required fields empty.',
  'Keep the first row as the column header.',
]

const IMPORTS = [
  {
    name: 'CSE_Students_2026.csv',
    meta: 'CSV · 248 KB',
    uploaded: 'Today, 10:42 AM',
    records: '524',
    status: 'completed',
    statusLabel: 'Completed',
  },
  {
    name: 'ECE_Students_2026.xlsx',
    meta: 'XLSX · 184 KB',
    uploaded: 'Yesterday, 4:18 PM',
    records: '412',
    status: 'errors',
    statusLabel: '3 errors',
  },
  {
    name: 'IT_FirstYear.csv',
    meta: 'CSV · 96 KB',
    uploaded: 'Sep 6, 2026',
    records: '286',
    status: 'completed',
    statusLabel: 'Completed',
  },
]

const STEPS = [
  { n: 1, title: 'Prepare file', desc: 'Use the provided template', active: true },
  { n: 2, title: 'Upload & validate', desc: 'Check student records' },
  { n: 3, title: 'Review', desc: 'Fix errors if needed' },
  { n: 4, title: 'Import', desc: 'Create student accounts' },
]

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isValidUpload(file) {
  const name = file.name.toLowerCase()
  const okExt = ['.csv', '.xls', '.xlsx'].some((ext) => name.endsWith(ext))
  if (!okExt) {
    window.alert('Please upload a CSV, XLS or XLSX file.')
    return false
  }
  if (file.size > 10 * 1024 * 1024) {
    window.alert('File size must be less than 10 MB.')
    return false
  }
  return true
}

function downloadTemplate() {
  const headers = COLUMNS
  const example = [
    'STU2026001',
    'Emma',
    'Wilson',
    'emma.wilson@example.com',
    'Computer Science',
    'CSE-A',
    'Active',
  ]
  const csv = `${headers.join(',')}\n${example.join(',')}\n`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'elytedu_student_upload_template.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function FileIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M6 2h9l3 3v17H6z" />
      <path strokeLinecap="round" d="M9 13h6M9 17h6M9 9h3" />
    </svg>
  )
}

function UploadIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4" />
      <path strokeLinecap="round" d="M5 20h14" />
    </svg>
  )
}

export default function AdminBulkUploadScreen() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  function acceptFile(next) {
    if (!next || !isValidUpload(next)) return
    setFile(next)
    setModalOpen(false)
  }

  function removeFile() {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) acceptFile(dropped)
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="w-full">
        <div className="mb-5 flex items-center gap-2 text-[13px] text-[#89918b]">
          <Link to="/admin/students" className="hover:text-brand">
            Students
          </Link>
          <span>/</span>
          <span className="font-semibold text-brand">Bulk Upload</span>
        </div>

        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">
              Bulk Student Upload
            </h1>
            <p className="mt-1 text-sm text-[#7A837D]">
              Add multiple student accounts to your college at once using a CSV or Excel file.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center gap-2 rounded-xl border border-[#dce2d8] bg-surface px-4 py-2.5 text-sm font-bold text-[#344139] hover:bg-[#f5f6f1]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4" />
                <path strokeLinecap="round" d="M5 21h14" />
              </svg>
              Download Template
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#185a42]"
            >
              <UploadIcon className="h-4 w-4" />
              Upload Students
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[#e3e7df] bg-surface p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            {STEPS.map((step, index) => (
              <div key={step.n} className="contents">
                <div className={`flex items-center gap-3 ${index > 0 ? 'mt-4 md:mt-0' : ''}`}>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold ${
                      step.active
                        ? 'bg-brand text-white'
                        : 'bg-[#e7ece4] text-[#68716b]'
                    }`}
                  >
                    {step.n}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-bold ${step.active ? '' : 'text-[#59625c]'}`}
                    >
                      {step.title}
                    </div>
                    <div className="text-[13px] text-[#8a928c]">{step.desc}</div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="mx-6 hidden h-px flex-1 bg-[#dfe4dc] md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.75fr]">
          <section className="rounded-2xl border border-[#e3e7df] bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">Upload student file</h2>
                <p className="mt-1 text-sm text-[#7A837D]">
                  Upload a CSV or Excel file containing your student records.
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1e8] text-brand">
                <UploadIcon />
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`mt-6 rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-12 ${
                dragging
                  ? 'border-brand bg-[#eef6ee]'
                  : 'border-[#cfd8cd] bg-[#f8faf5]'
              }`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand">
                <UploadIcon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-base font-extrabold">Drag & drop your file here</h3>
              <p className="mt-1 text-sm text-[#7A837D]">or choose a file from your computer</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-5 rounded-xl border border-[#d7ded4] bg-white px-5 py-2.5 text-sm font-bold text-[#344139] hover:bg-[#f5f7f2]"
              >
                Choose File
              </button>
              <p className="mt-4 text-[14px] text-[#929a94]">
                Supported formats: CSV, XLS, XLSX · Maximum file size: 10 MB
              </p>
            </div>

            {file && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#d8e5d7] bg-[#eef5ed] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand">
                  <FileIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{file.name}</div>
                  <div className="text-[13px] text-[#7A837D]">{formatFileSize(file.size)}</div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-[#7A837D] hover:bg-white"
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
            )}

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-extrabold">Required columns</div>
                <span className="text-[13px] text-[#7A837D]">7 columns</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {COLUMNS.map((col) => (
                  <span
                    key={col}
                    className="rounded-lg bg-[#f1f4ec] px-3 py-1.5 text-[13px] font-semibold"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-[#e3e7df] bg-surface p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e4] text-accent">
                  <FileIcon />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">Use our template</h3>
                  <p className="mt-0.5 text-[13px] text-[#7A837D]">Avoid formatting errors</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#69736d]">
                Download the ElytEdu template and fill in the student information using the
                required column format.
              </p>
              <button
                type="button"
                onClick={downloadTemplate}
                className="mt-4 w-full rounded-xl border border-[#dce2d8] py-2.5 text-sm font-bold hover:bg-[#f5f6f1]"
              >
                Download CSV Template
              </button>
            </section>

            <section className="rounded-2xl border border-[#e3e7df] bg-surface p-6">
              <h3 className="text-sm font-extrabold">Before uploading</h3>
              <div className="mt-4 space-y-4">
                {RULES.map((rule) => (
                  <div key={rule} className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f1e8] text-brand">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                      </svg>
                    </div>
                    <p className="text-[13px] leading-5 text-[#69736d]">{rule}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#e3e7df] bg-surface">
          <div className="flex flex-col gap-3 border-b border-[#e7ebe4] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold">Recent imports</h2>
              <p className="mt-1 text-sm text-[#7A837D]">
                Track your recent student upload activity.
              </p>
            </div>
            <button type="button" className="text-sm font-bold text-brand">
              View all imports →
            </button>
          </div>

          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="bg-[#f7f8f4] text-left">
                  {['File', 'Uploaded', 'Records', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-[14px] font-bold uppercase tracking-wider text-[#8a928c]"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-[14px] font-bold uppercase tracking-wider text-[#8a928c]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0eb]">
                {IMPORTS.map((row) => (
                  <tr key={row.name} className="hover:bg-[#fafbf8]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e9f2e9] text-brand">
                          <FileIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">{row.name}</div>
                          <div className="text-[14px] text-[#8a928c]">{row.meta}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#68716b]">{row.uploaded}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{row.records}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-bold ${
                          row.status === 'completed'
                            ? 'bg-[#e7f3e8] text-[#287047]'
                            : 'bg-[#fff1e7] text-[#b8682e]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            row.status === 'completed' ? 'bg-[#287047]' : 'bg-accent'
                          }`}
                        />
                        {row.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="text-[#68716b] hover:text-brand"
                        aria-label={`Actions for ${row.name}`}
                      >
                        <svg
                          className="inline h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17221d]/30 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false)
          }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#e1e6de] bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e6eae3] p-6">
              <div>
                <h2 className="text-xl font-extrabold">Upload students</h2>
                <p className="mt-1 text-[13px] text-[#7A837D]">
                  Select a CSV or Excel file to continue.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-xl text-[#69736d] hover:bg-[#f1f3ed]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border-2 border-dashed border-[#cfd8cd] bg-[#f8faf5] p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <UploadIcon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-sm font-bold">Choose your student file</div>
                <div className="mt-1 text-[13px] text-[#7A837D]">CSV, XLS or XLSX</div>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false)
                    inputRef.current?.click()
                  }}
                  className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white"
                >
                  Browse Files
                </button>
              </div>

              <div className="mt-5 flex gap-3 rounded-xl bg-[#f3f5ef] p-4">
                <svg
                  className="h-5 w-5 shrink-0 text-brand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" d="M12 11v5M12 8h.01" />
                </svg>
                <p className="text-[13px] leading-5 text-[#68716b]">
                  ElytEdu will validate every row before creating student accounts. Invalid
                  records can be corrected before importing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
