'use client';

interface StickySummaryBarProps {
  passedCount: number;
  failedCount: number;
  currentSemester: number;
  onSemesterChange: (semester: number) => void;
  onProcess: () => void;
}

export function StickySummaryBar({ passedCount, failedCount, currentSemester, onSemesterChange, onProcess }: StickySummaryBarProps) {
  return (
    <div className="sticky-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div className="sticky-stat">
          <span className="sticky-dot green" />
          ผ่าน {passedCount}
        </div>
        <div className="sticky-stat">
          <span className="sticky-dot red" />
          ตก {failedCount}
        </div>
        <select
          className="sticky-select"
          value={currentSemester}
          onChange={(e) => onSemesterChange(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <option key={s} value={s}>เทอม {s}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" onClick={onProcess}>
        ประมวลผล →
      </button>
    </div>
  );
}
