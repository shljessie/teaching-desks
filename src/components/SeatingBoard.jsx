import { useLang } from '../contexts/LanguageContext';
import { useState } from 'react';

export default function SeatingBoard({
  grid,
  gridCols,
  students,
  seatMap,
  setSeatMap,
}) {
  const { t } = useLang();
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [message, setMessage] = useState('');

  const deskPositions = [];
  grid.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      if (cell) deskPositions.push(`${ri}-${ci}`);
    });
  });

  const assignedStudentIds = new Set(Object.values(seatMap));
  const unassigned = students.filter((s) => !assignedStudentIds.has(s.id));

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const randomAssign = () => {
    if (students.length === 0) { showMessage(t('noStudents')); return; }
    if (deskPositions.length === 0) { showMessage(t('noDesks')); return; }
    if (students.length > deskPositions.length) { showMessage(t('notEnoughSeats')); return; }

    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const newMap = {};
    shuffled.forEach((s, i) => {
      if (i < deskPositions.length) {
        newMap[deskPositions[i]] = s.id;
      }
    });
    setSeatMap(newMap);
    showMessage(t('allSeatsAssigned'));
  };

  const shuffle = () => {
    const currentlyAssigned = Object.entries(seatMap);
    if (currentlyAssigned.length === 0) { randomAssign(); return; }

    const seats = currentlyAssigned.map(([pos]) => pos);
    const studentIds = currentlyAssigned.map(([, id]) => id).sort(() => Math.random() - 0.5);

    const newMap = {};
    seats.forEach((pos, i) => {
      newMap[pos] = studentIds[i];
    });
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
    interleaved.forEach((s, i) => {
      if (i < deskPositions.length) {
        newMap[deskPositions[i]] = s.id;
      }
    });
    setSeatMap(newMap);
    showMessage(t('allSeatsAssigned'));
  };

  const clearSeats = () => {
    setSeatMap({});
  };

  const handleDragStart = (student) => {
    setDraggedStudent(student);
  };

  const handleDragOverSeat = (e) => {
    e.preventDefault();
  };

  const handleDropOnSeat = (pos) => {
    if (!draggedStudent) return;

    const newMap = { ...seatMap };
    Object.keys(newMap).forEach((key) => {
      if (newMap[key] === draggedStudent.id) delete newMap[key];
    });

    newMap[pos] = draggedStudent.id;
    setSeatMap(newMap);
    setDraggedStudent(null);
  };

  const handleSeatClick = (pos) => {
    if (seatMap[pos]) {
      const newMap = { ...seatMap };
      delete newMap[pos];
      setSeatMap(newMap);
    }
  };

  const getStudentById = (id) => students.find((s) => s.id === id);

  return (
    <div className="panel seating-board">
      <h2 className="panel-title compact-title">🎯 {t('step3')}</h2>

      <div className="seating-controls">
        <button className="btn btn-primary btn-sm" onClick={randomAssign}>
          🎲 {t('randomAssign')}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={shuffle}>
          🔀 {t('shuffle')}
        </button>
        <button className="btn btn-accent btn-sm" onClick={boyGirlMix}>
          👦👧 {t('boyGirlMix')}
        </button>
        <button className="btn btn-danger btn-sm" onClick={clearSeats}>
          🗑 {t('clearSeats')}
        </button>
      </div>

      {message && <div className="message-banner">{message}</div>}

      <div className="seating-area">
        {/* Unassigned students */}
        <div className="unassigned-panel">
          <h3>{t('unassigned')} ({unassigned.length})</h3>
          <div className="unassigned-list">
            {unassigned.map((s) => (
              <div
                key={s.id}
                className={`student-card draggable ${s.gender === 'M' ? 'boy' : 'girl'}`}
                draggable
                onDragStart={() => handleDragStart(s)}
              >
                {s.gender === 'M' ? '👦' : '👧'} {s.name}
              </div>
            ))}
            {unassigned.length === 0 && students.length > 0 && (
              <p className="all-assigned">✅ {t('allSeatsAssigned')}</p>
            )}
            {students.length === 0 && (
              <p className="no-students">{t('noStudents')}</p>
            )}
          </div>
        </div>

        {/* Seating grid */}
        <div className="seating-grid-container" id="seating-printable">
          <div className="teacher-desk-area compact-teacher">
            <div className="teacher-desk">🏫 {t('teacherDesk')}</div>
          </div>

          <div
            className="seating-grid"
            style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
          >
            {grid.map((row, ri) =>
              row.map((cell, ci) => {
                const pos = `${ri}-${ci}`;
                const studentId = seatMap[pos];
                const student = studentId ? getStudentById(studentId) : null;

                if (!cell) {
                  return <div key={pos} className="seat-cell empty-cell" />;
                }

                return (
                  <div
                    key={pos}
                    className={`seat-cell desk-cell ${student ? (student.gender === 'M' ? 'occupied-boy' : 'occupied-girl') : 'vacant'}`}
                    onDragOver={handleDragOverSeat}
                    onDrop={() => handleDropOnSeat(pos)}
                    onClick={() => handleSeatClick(pos)}
                    title={student ? `${student.name} - ${t('clickToRemove')}` : t('seatEmpty')}
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
        </div>
      </div>
    </div>
  );
}
