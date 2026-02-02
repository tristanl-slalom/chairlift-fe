import { LoyaltyProgram } from '../types/customer.types';

interface LoyaltyBadgeProps {
  loyaltyProgram: LoyaltyProgram;
  showPoints?: boolean;
}

export function LoyaltyBadge({ loyaltyProgram, showPoints = true }: LoyaltyBadgeProps) {
  const getTierColor = (tier: LoyaltyProgram['tier']) => {
    switch (tier) {
      case 'PLATINUM':
        return 'bg-gradient-to-r from-gray-700 to-gray-900 text-white';
      case 'GOLD':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'SILVER':
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getTierIcon = (tier: LoyaltyProgram['tier']) => {
    switch (tier) {
      case 'PLATINUM':
        return '💎';
      case 'GOLD':
        return '⭐';
      case 'SILVER':
        return '🥈';
      default:
        return '';
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div className={`px-4 py-2 rounded-full font-semibold ${getTierColor(loyaltyProgram.tier)}`}>
        <span className="mr-2">{getTierIcon(loyaltyProgram.tier)}</span>
        {loyaltyProgram.tier}
      </div>
      {showPoints && (
        <div className="text-sm text-gray-600">
          <span className="font-semibold">{loyaltyProgram.points.toLocaleString()}</span> points
        </div>
      )}
    </div>
  );
}
