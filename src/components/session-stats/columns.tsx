import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { TableDataType } from '@/app/page';

// Get current month name dynamically (e.g., 'October', 'November', etc.)
const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

// Map raw CSV fields -> table-friendly keys
export function mappedMonthlySessionData(rawData: TableDataType[]) {
  return rawData.map((row) => ({
    'Employee Name': String(row[currentMonth] ?? ''),
    Sessions: String(row['_1'] ?? ''),
  }));
}

export const monthlySessionStatsColumns: ColumnDef<TableDataType>[] = [
  {
    accessorKey: 'Employee Name',
    header: 'Employee Name',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'Sessions',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='flex items-center'
      >
        Sessions
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: (info) => info.getValue(),
    enableSorting: true,
    sortingFn: 'alphanumericCaseSensitive',
  },
];
