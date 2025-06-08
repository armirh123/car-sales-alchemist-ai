
interface MarketInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'growth' | 'optimization' | 'warning';
  impact: 'high' | 'medium' | 'low';
  category?: string;
  percentage?: string;
  timestamp: Date;
}

interface StockAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  count?: number;
  percentage?: string;
  timestamp: Date;
}

interface MarketData {
  insights: MarketInsight[];
  alerts: StockAlert[];
  lastUpdated: Date;
}

class MarketDataService {
  private static instance: MarketDataService;
  private data: MarketData | null = null;

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  async fetchMarketData(): Promise<MarketData> {
    // Simulate API call to car market data providers
    console.log('Fetching real-time market data...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const insights: MarketInsight[] = [
      {
        id: '1',
        title: 'EV Market Surge',
        description: 'Electric vehicle demand increased 52% this week. Consider expanding EV inventory.',
        type: 'growth',
        impact: 'high',
        category: 'Electric',
        percentage: '+52%',
        timestamp: new Date()
      },
      {
        id: '2',
        title: 'SUV Winter Demand',
        description: 'SUV searches up 28% as winter approaches. Optimize pricing strategy.',
        type: 'opportunity',
        impact: 'medium',
        category: 'SUVs',
        percentage: '+28%',
        timestamp: new Date()
      },
      {
        id: '3',
        title: 'Luxury Price Optimization',
        description: 'Luxury market allows 15% price increase based on current demand trends.',
        type: 'optimization',
        impact: 'high',
        category: 'Luxury',
        percentage: '+15%',
        timestamp: new Date()
      }
    ];

    const alerts: StockAlert[] = [
      {
        id: '1',
        title: 'Critical: Electric Vehicle Stock',
        description: 'EV inventory at 8% capacity. High demand expected due to tax incentives.',
        severity: 'critical',
        category: 'Electric',
        count: 3,
        percentage: '8%',
        timestamp: new Date()
      },
      {
        id: '2',
        title: 'Low Stock: Premium SUVs',
        description: 'Premium SUV inventory down 67%. Winter season driving higher demand.',
        severity: 'warning',
        category: 'SUVs',
        count: 12,
        percentage: '-67%',
        timestamp: new Date()
      },
      {
        id: '3',
        title: 'Market Opportunity: Sports Cars',
        description: 'Sports car interest increased 34%. Consider promotional campaigns.',
        severity: 'info',
        category: 'Sports',
        percentage: '+34%',
        timestamp: new Date()
      }
    ];

    this.data = {
      insights,
      alerts,
      lastUpdated: new Date()
    };

    return this.data;
  }

  getLastUpdated(): Date | null {
    return this.data?.lastUpdated || null;
  }
}

export { MarketDataService };
export type { MarketData, MarketInsight, StockAlert };
