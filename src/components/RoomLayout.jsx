import { useLang } from '../contexts/LanguageContext';
import { useState } from 'react';

function generatePreset(preset, rows, cols) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));

  switch (preset) {
    case 'rows': {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) grid[r][c] = true;
      break;
    }
    case 'paired': {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) grid[r][c] = (c % 3) < 2;
      break;
    }
    case 'ushape': {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          grid[r][c] = r === rows - 1 || c === 0 || c === cols - 1;
      break;
    }
    case 'groups4': {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) grid[r][c] = (r % 3) < 2 && (c % 3) < 2;
      break;
    }
    case 'groups6': {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) grid[r][c] = (r % 4) < 3 && (c % 4) < 3;
      break;
    }
    case 'circle': {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          grid[r][c] = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
      break;
    }
    case 'empty':
    default:
      break;
  }
  return grid;
}

export default function RoomLayout({
  grid, setGrid, gridRows, gridCols, setGridRows, setGridCols,
  students, seatMap, setSeatMap, chartTitle,
}) {
  const { t } = useLang();
  const [isPainting, setIsPainting] = useState(false);
  const [paintValue, setPaintValue] = useState(true);
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('edit'); // 'edit' or 'assign'

  const deskCount = grid.flat().filter(Boolean).length;

  // Desk positions for assignment
  const deskPositions = [];
  grid.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      if (cell) deskPositions.push(`${ri}-${ci}`);
    });
  });

  const assignedStudentIds = new Set(Object.values(seatMap));
  const unassigned = students.filter((s) => !assignedStudentIds.has(s.id));
  const getStudentById = (id) => students.find((s) => s.id === id);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // ---- Grid editing ----
  const applyPreset = (preset) => {
    setGrid(generatePreset(preset, gridRows, gridCols));
    setSeatMap({});
  };

  const addRow = () => {
    if (gridRows >= 12) return;
    setGridRows(gridRows + 1);
    setGrid([...grid, Array(gridCols).fill(false)]);
  };
  const removeRowAt = (rowIdx) => {
    if (gridRows <= 1) return;
    const newGrid = grid.filter((_, i) => i !== rowIdx);
    setGridRows(gridRows - 1);
    setGrid(newGrid);
    // Remap seats: rows after deleted one shift up
    const newMap = {};
    Object.entries(seatMap).forEach(([pos, id]) => {
      const [r, c] = pos.split('-').map(Number);
      if (r < rowIdx) newMap[pos] = id;
      else if (r > rowIdx) newMap[`${r - 1}-${c}`] = id;
      // r === rowIdx → removed
    });
    setSeatMap(newMap);
  };
  const addCol = () => {
    if (gridCols >= 14) return;
    setGridCols(gridCols + 1);
    setGrid(grid.map((row) => [...row, false]));
  };
  const removeColAt = (colIdx) => {
    if (gridCols <= 1) return;
    const newGrid = grid.map((row) => row.filter((_, i) => i !== colIdx));
    setGridCols(gridCols - 1);
    setGrid(newGrid);
    // Remap seats: cols after deleted one shift left
    const newMap = {};
    Object.entries(seatMap).forEach(([pos, id]) => {
      const [r, c] = pos.split('-').map(Number);
      if (c < colIdx) newMap[pos] = id;
      else if (c > colIdx) newMap[`${r}-${c - 1}`] = id;
    });
    setSeatMap(newMap);
  };

  const handleMouseDown = (r, c) => {
    if (mode !== 'edit') return;
    setIsPainting(true);
    const newVal = !grid[r][c];
    setPaintValue(newVal);
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = newVal;
    setGrid(newGrid);
    // If turning off a desk, remove student from that seat
    if (!newVal) {
      const pos = `${r}-${c}`;
      if (seatMap[pos]) {
        const nm = { ...seatMap };
        delete nm[pos];
        setSeatMap(nm);
      }
    }
  };

  const handleMouseEnter = (r, c) => {
    if (mode !== 'edit' || !isPainting) return;
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = paintValue;
    setGrid(newGrid);
    if (!paintValue) {
      const pos = `${r}-${c}`;
      if (seatMap[pos]) {
        const nm = { ...seatMap };
        delete nm[pos];
        setSeatMap(nm);
      }
    }
  };

  const handleMouseUp = () => setIsPainting(false);

  const clearAll = () => {
    setGrid(Array.from({ length: gridRows }, () => Array(gridCols).fill(false)));
    setSeatMap({});
  };
  const fillAll = () => {
    setGrid(Array.from({ length: gridRows }, () => Array(gridCols).fill(true)));
  };

  // ---- Seat assignment ----
  const randomAssign = () => {
    if (students.length === 0) { showMessage(t('noStudents')); return; }
    if (deskPositions.length === 0) { showMessage(t('noDesks')); return; }
    if (students.length > deskPositions.length) { showMessage(t('notEnoughSeats')); return; }
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const newMap = {};
    shuffled.forEach((s, i) => { if (i < deskPositions.length) newMap[deskPositions[i]] = s.id; });
    setSeatMap(newMap);
    showMessage(t('allSeatsAssigned'));
  };

  const shuffle = () => {
    const entries = Object.entries(seatMap);
    if (entries.length === 0) { randomAssign(); return; }
    const seats = entries.map(([pos]) => pos);
    const ids = entries.map(([, id]) => id).sort(() => Math.random() - 0.5);
    const newMap = {};
    seats.forEach((pos, i) => { newMap[pos] = ids[i]; });
    setSeatMap(newMap);
  };

  const boyGirlMix = () => {
    if (students.length === 0) { showMessage(t('noStudents')); return; }
    if (deskPositions.length === 0) { showMessage(t('noDesks')); return; }
    if (students.length > deskPositions.length) { showMessage(t('notEnoughSeats')); return; }
    const boys = students.filter((s) => s.gender === 'M').sort(() => Math.random() - 0.5);
    const girls = students.filter((s) => s.gender === 'F').sort(() => Math.random() - 0.5);
    const interleaved = [];
    const maxLen = Math.max(boys.length, girls.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < boys.length) interleaved.push(boys[i]);
      if (i < girls.length) interleaved.push(girls[i]);
    }
    const newMap = {};
    interleaved.forEach((s, i) => { if (i < deskPositions.length) newMap[deskPositions[i]] = s.id; });
    setSeatMap(newMap);
    showMessage(t('allSeatsAssigned'));
  };

  const clearSeats = () => setSeatMap({});

  const [dragOverPos, setDragOverPos] = useState(null);

  // Drag & drop
  const handleDragStart = (student, e) => {
    setDraggedStudent(student);
    if (e && e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };
  const handleDragOverSeat = (e, pos) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverPos(pos);
  };
  const handleDragLeaveSeat = () => {
    setDragOverPos(null);
  };
  const handleDropOnSeat = (pos) => {
    if (!draggedStudent) return;
    const newMap = { ...seatMap };
    // If dropping on a seat that already has someone, swap them
    const existingStudentId = newMap[pos];
    // Find where the dragged student was sitting (if anywhere)
    const draggedFromPos = Object.keys(newMap).find((key) => newMap[key] === draggedStudent.id);
    // Remove dragged student from old position
    if (draggedFromPos) delete newMap[draggedFromPos];
    // If there was someone in the target seat, move them to the dragged student's old seat
    if (existingStudentId && draggedFromPos) {
      newMap[draggedFromPos] = existingStudentId;
    }
    // Place dragged student in new seat
    newMap[pos] = draggedStudent.id;
    setSeatMap(newMap);
    setDraggedStudent(null);
    setDragOverPos(null);
  };
  const handleDropOnUnassigned = (e) => {
    e.preventDefault();
    if (!draggedStudent) return;
    const newMap = { ...seatMap };
    Object.keys(newMap).forEach((key) => { if (newMap[key] === draggedStudent.id) delete newMap[key]; });
    setSeatMap(newMap);
    setDraggedStudent(null);
    setDragOverPos(null);
  };
  const handleDragEnd = () => {
    setDraggedStudent(null);
    setDragOverPos(null);
  };
  const handleSeatClick = (pos) => {
    if (mode !== 'assign') return;
    if (seatMap[pos]) {
      const newMap = { ...seatMap };
      delete newMap[pos];
      setSeatMap(newMap);
    }
  };

  const presets = [
    { key: 'rows', icon: '▤' },
    { key: 'paired', icon: '▥' },
    { key: 'ushape', icon: '⊔' },
    { key: 'groups4', icon: '⊞' },
    { key: 'groups6', icon: '⊟' },
    { key: 'circle', icon: '◻' },
    { key: 'empty', icon: '○' },
  ];
  const presetLabelMap = {
    rows: 'presetRows', paired: 'presetPaired', ushape: 'presetUShape',
    groups4: 'presetGroups4', groups6: 'presetGroups6', circle: 'presetCircle', empty: 'presetEmpty',
  };

  return (
    <div className="panel combined-panel">
      {/* Print-only title */}
      {chartTitle && (
        <div className="print-chart-title">
          <h1>{chartTitle}</h1>
        </div>
      )}

      {/* ===== Toolbar ===== */}
      <div className="combined-toolbar">
        {/* Mode toggle */}
        <div className="mode-toggle">
          <button
            className={`btn btn-sm mode-btn ${mode === 'edit' ? 'mode-active' : ''}`}
            onClick={() => setMode('edit')}
          >🏗️ {t('editLayout')}</button>
          <button
            className={`btn btn-sm mode-btn ${mode === 'assign' ? 'mode-active' : ''}`}
            onClick={() => setMode('assign')}
          >🎯 {t('assignSeats')}</button>
        </div>

        {/* Context-dependent controls */}
        {mode === 'edit' ? (
          <div className="toolbar-row">
            <div className="presets-bar">
              {presets.map((p) => (
                <button
                  key={p.key}
                  className="btn btn-preset"
                  onClick={() => applyPreset(p.key)}
                  title={t(presetLabelMap[p.key])}
                >
                  <span className="preset-icon">{p.icon}</span>
                  <span className="preset-name">{t(presetLabelMap[p.key])}</span>
                </button>
              ))}
            </div>
            <div className="toolbar-actions">
              <button className="btn btn-secondary btn-sm" onClick={clearAll}>{t('clearAll')}</button>
              <button className="btn btn-secondary btn-sm" onClick={fillAll}>{t('fillAll')}</button>
            </div>
          </div>
        ) : (
          <div className="toolbar-row">
            <div className="seating-controls">
              <button className="btn btn-primary btn-sm" onClick={randomAssign}>🎲 {t('randomAssign')}</button>
              <button className="btn btn-secondary btn-sm" onClick={shuffle}>🔀 {t('shuffle')}</button>
              <button className="btn btn-accent btn-sm" onClick={boyGirlMix}>👦👧 {t('boyGirlMix')}</button>
              <button className="btn btn-danger btn-sm" onClick={clearSeats}>🗑 {t('clearSeats')}</button>
            </div>
          </div>
        )}
      </div>

      {message && <div className="message-banner">{message}</div>}

      {/* ===== Unassigned students bar (visible in assign mode) ===== */}
      {mode === 'assign' && students.length > 0 && (
        <div
          className={`unassigned-bar ${draggedStudent && !unassigned.find(s => s.id === draggedStudent.id) ? 'drop-target-active' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnUnassigned}
        >
          <span className="unassigned-label">{t('unassigned')} ({unassigned.length}):</span>
          <div className="unassigned-chips">
            {unassigned.map((s) => (
              <div
                key={s.id}
                className={`student-card draggable ${s.gender === 'M' ? 'boy' : 'girl'}`}
                draggable
                onDragStart={(e) => handleDragStart(s, e)}
                onDragEnd={handleDragEnd}
              >
                {s.gender === 'M' ? '👦' : '👧'} {s.name}
              </div>
            ))}
            {unassigned.length === 0 && (
              <span className="all-assigned-inline">✅ {t('allSeatsAssigned')}</span>
            )}
          </div>
        </div>
      )}
      {mode === 'assign' && students.length === 0 && (
        <div className="no-students-bar">{t('noStudents')}</div>
      )}

      {/* ===== The Grid ===== */}
      <div className="room-container" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <div className="teacher-desk-area compact-teacher">
          <div className="teacher-desk">🏫 {t('teacherDesk')}</div>
        </div>

        {/* Info bar */}
        {mode === 'edit' && (
          <div className="grid-info-bar">
            <span className="edge-info">{gridRows}×{gridCols} · {deskCount} {t('desks')}</span>
          </div>
        )}

        {/* Top edge: per-column − buttons */}
        {mode === 'edit' && (
          <div className="edge-row-top" style={{ gridTemplateColumns: `24px repeat(${gridCols}, 1fr) 28px` }}>
            <div />
            {Array.from({ length: gridCols }, (_, ci) => (
              <button
                key={ci}
                className="edge-btn-cell edge-btn-minus"
                onClick={() => removeColAt(ci)}
                disabled={gridCols <= 1}
                title={`Delete column ${ci + 1}`}
              >−</button>
            ))}
            <div />
          </div>
        )}

        <div className="grid-with-edges">
          {/* Left edge: per-row − buttons */}
          {mode === 'edit' && (
            <div className="edge-col-left" style={{ gridTemplateRows: `repeat(${gridRows}, 1fr)` }}>
              {Array.from({ length: gridRows }, (_, ri) => (
                <button
                  key={ri}
                  className="edge-btn-cell edge-btn-minus"
                  onClick={() => removeRowAt(ri)}
                  disabled={gridRows <= 1}
                  title={`Delete row ${ri + 1}`}
                >−</button>
              ))}
            </div>
          )}

          {/* The grid */}
          <div
            className={`combined-grid ${mode === 'assign' ? 'assign-mode' : 'edit-mode'}`}
            style={{
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gridTemplateRows: `repeat(${gridRows}, 1fr)`,
            }}
          >
            {grid.map((row, ri) =>
              row.map((cell, ci) => {
                const pos = `${ri}-${ci}`;
                const studentId = seatMap[pos];
                const student = studentId ? getStudentById(studentId) : null;

                if (mode === 'edit') {
                  return (
                    <div
                      key={pos}
                      className={`grid-cell ${cell ? 'active' : 'inactive'}`}
                      onMouseDown={() => handleMouseDown(ri, ci)}
                      onMouseEnter={() => handleMouseEnter(ri, ci)}
                    >
                      {cell ? '🪑' : ''}
                    </div>
                  );
                }

                // Assign mode
                if (!cell) {
                  return <div key={pos} className="seat-cell empty-cell" />;
                }

                return (
                  <div
                    key={pos}
                    className={`seat-cell desk-cell ${student ? (student.gender === 'M' ? 'occupied-boy' : 'occupied-girl') : 'vacant'} ${dragOverPos === pos ? 'drag-over' : ''}`}
                    draggable={!!student}
                    onDragStart={(e) => student && handleDragStart(student, e)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOverSeat(e, pos)}
                    onDragLeave={handleDragLeaveSeat}
                    onDrop={() => handleDropOnSeat(pos)}
                    onClick={() => handleSeatClick(pos)}
                    title={student ? `${student.name} - ${t('dragToSwap')}` : t('seatEmpty')}
                  >
                    {student ? (
                      <div className="seated-student">
                        <span className="seated-emoji">{student.gender === 'M' ? '👦' : '👧'}</span>
                        <span className="seated-name">{student.name}</span>
                      </div>
                    ) : (
                      <span className="empty-seat">🪑</span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right edge: add col (+) */}
          {mode === 'edit' && (
            <button className="edge-add-strip edge-add-col" onClick={addCol} disabled={gridCols >= 14}>
              <span>+</span>
            </button>
          )}
        </div>

        {/* Bottom edge: add row (+) */}
        {mode === 'edit' && (
          <button className="edge-add-strip edge-add-row" onClick={addRow} disabled={gridRows >= 12}>
            <span>+</span>
          </button>
        )}
      </div>
    </div>
  );
}
