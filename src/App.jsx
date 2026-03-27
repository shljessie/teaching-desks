import './App.css';

import { LanguageProvider, useLang } from './contexts/LanguageContext';
import { useCallback, useState } from 'react';

import CSVUploader from './components/CSVUploader';
import LanguageSwitcher from './components/LanguageSwitcher';
import RoomLayout from './components/RoomLayout';

function AppContent() {
  const { t } = useLang();

  const [students, setStudents] = useState([]);
  const [gridRows, setGridRows] = useState(5);
  const [gridCols, setGridCols] = useState(6);
  const [grid, setGrid] = useState(() =>
    Array.from({ length: 5 }, () => Array(6).fill(false))
  );
  const [seatMap, setSeatMap] = useState({});
  const [chartTitle, setChartTitle] = useState('');

  const applyDeskCount = useCallback((count) => {
    if (count <= 0) return;
    let bestCols = Math.ceil(Math.sqrt(count * 1.3));
    bestCols = Math.max(2, Math.min(14, bestCols));
    let bestRows = Math.ceil(count / bestCols);
    bestRows = Math.max(2, Math.min(12, bestRows));
    bestCols = Math.ceil(count / bestRows);
    bestCols = Math.max(2, Math.min(14, bestCols));

    setGridRows(bestRows);
    setGridCols(bestCols);

    let remaining = count;
    const newGrid = Array.from({ length: bestRows }, () =>
      Array.from({ length: bestCols }, () => {
        if (remaining > 0) { remaining--; return true; }
        return false;
      })
    );
    setGrid(newGrid);
    setSeatMap({});
  }, []);

  const handlePrint = () => {
    const title = prompt(t('chartTitlePrompt'), chartTitle);
    if (title === null) return; // user cancelled
    setChartTitle(title);
    // Small delay so React can re-render the title before printing
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">🏫 {t('appTitle')}</h1>
          <p className="app-subtitle">{t('appSubtitle')}</p>
        </div>
        <div className="header-right">
          <LanguageSwitcher />
          <button className="btn btn-primary btn-sm no-print" onClick={handlePrint}>
            🖨 {t('print')}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="main-layout">
          <CSVUploader
            students={students}
            setStudents={setStudents}
            onApplyDeskCount={applyDeskCount}
          />

          <RoomLayout
            grid={grid}
            setGrid={setGrid}
            gridRows={gridRows}
            gridCols={gridCols}
            setGridRows={setGridRows}
            setGridCols={setGridCols}
            students={students}
            seatMap={seatMap}
            setSeatMap={setSeatMap}
            chartTitle={chartTitle}
          />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
