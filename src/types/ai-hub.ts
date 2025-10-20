
export interface AINode {
  id: number | string;
  name: string;
  status: string;
  config: any;
  location: string;
  lastUpdated: string;
  performance: number;
  threats: number;
}

export interface ActivityFeedItem {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: React.ReactNode;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}
