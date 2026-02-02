interface StatusPreviewProps {
  displayName: string;
  color: string;
  icon: string;
}

export default function StatusPreview({ displayName, color, icon }: StatusPreviewProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700">Preview</h3>

      {/* Task card preview */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Example Task Title</h4>
            <p className="text-sm text-gray-500 mt-1">This is how a task card looks</p>
          </div>
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: color + '20', // 20% opacity
              color: color,
              border: `1px solid ${color}`
            }}
          >
            <span>{icon}</span>
            <span>{displayName}</span>
          </span>
        </div>
      </div>

      {/* Status badge preview */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Badge:</span>
        <span
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
          style={{ backgroundColor: color, color: '#fff' }}
        >
          {icon} {displayName}
        </span>
      </div>

      {/* Filter chip preview */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Filter:</span>
        <button
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border-2 transition-colors"
          style={{ borderColor: color, color: color }}
        >
          {icon} {displayName}
        </button>
      </div>
    </div>
  );
}
