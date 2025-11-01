import { TableDataType } from '@/app/page';

export async function fetchSessionStats() {
  try {
    const res = await fetch('/api/session-stats', { cache: 'no-store' });
    const json = await res.json();
    const allRows = json.data as TableDataType[];

    // optional: remove any nonsense placeholders or summary rows
    const cleanRows = allRows.filter((row) => {
      const firstKey = Object.keys(row)[0];
      const value = (row[firstKey] || '').toString().trim();
      return (
        value && 
        value !== 'Employee' && 
        value !== 'Total Month Sessions' &&
        value !== 'Count'
      );
    });

    // frontend can compute totals dynamically later 
    return {
      totalMonthSessions: cleanRows.length,
      monthlyData: cleanRows,
    };
  } catch (error) {
    console.error('Error fetching session stats:', error);
    return { totalMonthSessions: 0, monthlyData: [] };
  }
}
