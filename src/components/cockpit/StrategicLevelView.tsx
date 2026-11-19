import React from 'react';
import {
  StrategicKPIs,
  EconomicMetrics,
  CockpitAlert,
  InformationDomain,
} from '../../types/cockpit';
import { OwnerStrategicPerspective } from './OwnerStrategicPerspective';

interface StrategicLevelViewProps {
  strategicMetrics: StrategicKPIs;
  economicMetrics: EconomicMetrics;
  alerts: CockpitAlert[];
  selectedDomain: InformationDomain;
  onActionClick: (alert: CockpitAlert) => void;
}

export const StrategicLevelView: React.FC<StrategicLevelViewProps> = ({
  strategicMetrics,
  economicMetrics,
  alerts,
  selectedDomain,
  onActionClick,
}) => {
  const strategicAlerts = alerts.filter(
    (a) => a.level === 'estrategico' || a.severity === 'red'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <OwnerStrategicPerspective
        strategicMetrics={strategicMetrics}
        economicMetrics={economicMetrics}
        strategicAlerts={strategicAlerts}
        onActionClick={onActionClick}
      />
    </div>
  );
};
