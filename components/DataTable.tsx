import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  maxRows?: number;
  emptyMessage?: string;
  compact?: boolean;
  onRowClick?: (row: T) => void;
}

function DataTable<T extends Record<string, any>>({ columns, data, keyField, maxRows, emptyMessage = 'No data', compact = false, onRowClick }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedData = useMemo(() => {
    let result = [...data];
    if (sortKey) {
      result.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av;
        }
        const as = String(av);
        const bs = String(bv);
        return sortDir === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
      });
    }
    if (maxRows) result = result.slice(0, maxRows);
    return result;
  }, [data, sortKey, sortDir, maxRows]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  if (!data.length) {
    return <div className="text-xs text-gray-400 text-center py-6">{emptyMessage}</div>;
  }

  const cellPadding = compact ? 'px-2 py-1.5' : 'px-3 py-2';
  const textSize = compact ? 'text-[10px]' : 'text-xs';

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {columns.map(col => (
              <th
                key={col.key}
                className={`${cellPadding} ${textSize} font-semibold text-gray-500 uppercase tracking-wide ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                } ${col.sortable ? 'cursor-pointer hover:text-gray-700 select-none' : ''}`}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="flex items-center gap-0.5">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(row => (
            <tr
              key={row[keyField]}
              className={`border-t border-gray-50 ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={`${cellPadding} ${textSize} text-gray-700 ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
