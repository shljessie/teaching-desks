import { useRef, useState } from 'react';

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useLang } from '../contexts/LanguageContext';

export default function CSVUploader({ students, setStudents, onApplyDeskCount }) {
  const { t } = useLang();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState('M');
  const [deskCount, setDeskCount] = useState('');

  const handleApplyDeskCount = () => {
    const num = parseInt(deskCount, 10);
    if (num > 0 && onApplyDeskCount) {
      onApplyDeskCount(num);
    }
  };

  const parseRows = (rows) => {
    return rows
      .map((row, i) => {
        const name = row.name || row.Name || row['이름'] || row['姓名'] || '';
        const genderRaw = (
          row.gender || row.Gender || row['성별'] || row['性别'] || ''
        ).trim().toUpperCase();
        const gender = genderRaw.startsWith('F') || genderRaw === '여' || genderRaw === '女'
          ? 'F' : 'M';
        return { id: `s-${Date.now()}-${i}`, name: String(name).trim(), gender };
      })
      .filter((s) => s.name);
  };

  const processCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setStudents(parseRows(results.data));
      },
    });
  };

  const processXLSX = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
      setStudents(parseRows(rows));
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv') {
      processCSV(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      processXLSX(file);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const downloadSample = () => {
    const csv = 'name,gender\nAlice,F\nBob,M\nCharlie,M\nDiana,F\nEthan,M\nFiona,F\nGeorge,M\nHannah,F\n민수,M\n서연,F\n지호,M\n하은,F';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const addStudent = () => {
    if (!newName.trim()) return;
    setStudents([...students, {
      id: `s-${Date.now()}`,
      name: newName.trim(),
      gender: newGender,
    }]);
    setNewName('');
  };

  const removeStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <div className="panel csv-uploader">
      <h2 className="panel-title compact-title">📋 {t('step1')}</h2>

      {/* 책상 수 입력 */}
      <div className="desk-count-section">
        <label className="desk-count-label">🪑 {t('totalDeskCount')}</label>
        <div className="desk-count-input-row">
          <input
            type="number"
            min="1"
            max="60"
            placeholder="ex) 24"
            value={deskCount}
            onChange={(e) => setDeskCount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyDeskCount()}
            className="input desk-count-input"
          />
          <span className="desk-count-unit">{t('desks')}</span>
          <button className="btn btn-primary" onClick={handleApplyDeskCount}>
            {t('applyDeskCount')}
          </button>
        </div>
        <p className="desk-count-hint">{t('deskCountHint')}</p>
      </div>

      <div className="section-divider" />

      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="drop-icon">📄</div>
        <p>{t('dragDropFile')}</p>
        <p className="drop-hint">{t('csvFormat')}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
      </div>

      <button className="btn btn-secondary btn-sm" onClick={downloadSample}>
        ⬇ {t('downloadSample')}
      </button>

      {students.length > 0 && (
        <div className="students-summary">
          <div className="summary-header">
            <span className="student-count">
              {students.length} {t('studentsLoaded')}
              <span className="gender-summary">
                ({students.filter(s => s.gender === 'M').length} {t('boy')} / {students.filter(s => s.gender === 'F').length} {t('girl')})
              </span>
            </span>
            <button className="btn btn-danger btn-sm" onClick={() => setStudents([])}>
              {t('clearStudents')}
            </button>
          </div>

          <div className="student-list">
            {students.map((s) => (
              <div key={s.id} className={`student-chip ${s.gender === 'M' ? 'boy' : 'girl'}`}>
                <span>{s.gender === 'M' ? '👦' : '👧'} {s.name}</span>
                <button className="chip-remove" onClick={() => removeStudent(s.id)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="add-student-form">
        <input
          type="text"
          placeholder={t('addStudentName')}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addStudent()}
          className="input"
        />
        <select
          value={newGender}
          onChange={(e) => setNewGender(e.target.value)}
          className="select"
        >
          <option value="M">{t('boy')}</option>
          <option value="F">{t('girl')}</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={addStudent}>
          + {t('addStudent')}
        </button>
      </div>
    </div>
  );
}
