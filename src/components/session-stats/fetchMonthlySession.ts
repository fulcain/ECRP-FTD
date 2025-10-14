import Papa from 'papaparse';
import { TableDataType } from '@/app/page';

const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

export async function fetchSessionStats() {
  const res = await fetch('/api/session-stats');
  const csvText = await res.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const data = parsed.data as TableDataType[];

  // Filter out unwanted header/footer rows
  const filteredData = data.filter((row) => {
    const name = (row[currentMonth] || '').toString().trim();
    return (
      name !== 'Employee' &&
      name !== 'Total Month Sessions' &&
      name !== 'Count' &&
      name !== ''
    );
  });

  // Compute the total sessions from the remaining valid rows
  const totalMonthSessions = filteredData.reduce(
    (sum, row) => sum + (Number(row['_1']) || 0),
    0
  );

  return {
    totalMonthSessions,
    monthlyData: filteredData,
  };
}
