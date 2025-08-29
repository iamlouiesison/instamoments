'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useMonitoring, PerformanceMetrics } from '@/lib/monitoring';
import { getHealthStatus, HealthCheck } from '@/lib/monitoring';

interface PerformanceData {
  metrics: Partial<PerformanceMetrics>;
  health: HealthCheck | null;
  lastUpdate: Date;
}

export function PerformanceMonitor() {
  const { getPerformanceMetrics, getHealthStatus: getCurrentHealthStatus } = useMonitoring();
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    metrics: {},
    health: null,
    lastUpdate: new Date(),
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!isMonitoring) return;

    const updatePerformance = () => {
      const metrics = getPerformanceMetrics();
      const health = getCurrentHealthStatus();
      
      setPerformanceData({
        metrics,
        health,
        lastUpdate: new Date(),
      });
    };

    // Initial update
    updatePerformance();

    // Update every 5 seconds
    const interval = setInterval(updatePerformance, 5000);

    return () => clearInterval(interval);
  }, [isMonitoring, getPerformanceMetrics, getCurrentHealthStatus]);

  const startMonitoring = () => {
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const getPerformanceScore = (metrics: Partial<PerformanceMetrics>): number => {
    let score = 100;
    let checks = 0;

    // Check LCP (should be < 2.5s)
    if (metrics.largestContentfulPaint) {
      checks++;
      if (metrics.largestContentfulPaint > 2500) score -= 20;
      else if (metrics.largestContentfulPaint > 1800) score -= 10;
    }

    // Check FID (should be < 100ms)
    if (metrics.firstInputDelay) {
      checks++;
      if (metrics.firstInputDelay > 100) score -= 20;
      else if (metrics.firstInputDelay > 50) score -= 10;
    }

    // Check CLS (should be < 0.1)
    if (metrics.cumulativeLayoutShift) {
      checks++;
      if (metrics.cumulativeLayoutShift > 0.1) score -= 20;
      else if (metrics.cumulativeLayoutShift > 0.05) score -= 10;
    }

    // Check TTFB (should be < 800ms)
    if (metrics.timeToFirstByte) {
      checks++;
      if (metrics.timeToFirstByte > 800) score -= 20;
      else if (metrics.timeToFirstByte > 600) score -= 10;
    }

    return checks > 0 ? Math.max(0, score) : 100;
  };

  const getPerformanceColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 30) return 'Poor';
    return 'Critical';
  };

  const getHealthStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4" />;
      case 'unhealthy': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const performanceScore = getPerformanceScore(performanceData.metrics);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Monitor
            </CardTitle>
            <CardDescription>
              Real-time performance metrics and system health
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!isMonitoring ? (
              <Button onClick={startMonitoring} size="sm" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Start Monitoring
              </Button>
            ) : (
              <Button onClick={stopMonitoring} size="sm" variant="outline" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Stop Monitoring
              </Button>
            )}
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              size="sm"
              variant="ghost"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!isMonitoring ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Click "Start Monitoring" to begin tracking performance metrics</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Performance Score */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: getPerformanceColor(performanceScore) }}>
                {performanceScore}
              </div>
              <Badge variant="outline" className="text-lg">
                {getPerformanceBadge(performanceScore)}
              </Badge>
              <Progress value={performanceScore} className="mt-4 max-w-xs mx-auto" />
            </div>

            {/* Core Web Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="LCP"
                value={performanceData.metrics.largestContentfulPaint}
                unit="ms"
                target={2500}
                description="Largest Contentful Paint"
                icon={<Clock className="w-4 h-4" />}
              />
              <MetricCard
                title="FID"
                value={performanceData.metrics.firstInputDelay}
                unit="ms"
                target={100}
                description="First Input Delay"
                icon={<Zap className="w-4 h-4" />}
              />
              <MetricCard
                title="CLS"
                value={performanceData.metrics.cumulativeLayoutShift}
                unit=""
                target={0.1}
                description="Cumulative Layout Shift"
                icon={<Activity className="w-4 h-4" />}
              />
              <MetricCard
                title="TTFB"
                value={performanceData.metrics.timeToFirstByte}
                unit="ms"
                target={800}
                description="Time to First Byte"
                icon={<Clock className="w-4 h-4" />}
              />
            </div>

            {/* System Health */}
            {performanceData.health && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  System Health
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <HealthCheckItem
                    name="API"
                    status={performanceData.health.checks.api}
                    responseTime={performanceData.health.responseTime}
                  />
                  <HealthCheckItem
                    name="Database"
                    status={performanceData.health.checks.database}
                    responseTime={performanceData.health.responseTime}
                  />
                  <HealthCheckItem
                    name="Storage"
                    status={performanceData.health.checks.storage}
                    responseTime={performanceData.health.responseTime}
                  />
                  <HealthCheckItem
                    name="Auth"
                    status={performanceData.health.checks.auth}
                    responseTime={performanceData.health.responseTime}
                  />
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Overall Status:{' '}
                  <span className={`font-medium ${getHealthStatusColor(performanceData.health.status)}`}>
                    {performanceData.health.status}
                  </span>
                  {' • '}
                  Response Time: {performanceData.health.responseTime}ms
                  {' • '}
                  Last Check: {performanceData.health.timestamp.toLocaleTimeString()}
                </div>
              </div>
            )}

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Detailed Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Page Load Time:</strong> {performanceData.metrics.pageLoadTime?.toFixed(2) || 'N/A'}ms
                  </div>
                  <div>
                    <strong>DOM Content Loaded:</strong> {performanceData.metrics.domContentLoaded?.toFixed(2) || 'N/A'}ms
                  </div>
                  <div>
                    <strong>Window Load:</strong> {performanceData.metrics.windowLoad?.toFixed(2) || 'N/A'}ms
                  </div>
                  <div>
                    <strong>Last Update:</strong> {performanceData.lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}

            {/* Last Update */}
            <div className="text-center text-sm text-muted-foreground">
              Last updated: {performanceData.lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value?: number;
  unit: string;
  target: number;
  description: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, unit, target, description, icon }: MetricCardProps) {
  const isGood = value !== undefined && value <= target;
  const isWarning = value !== undefined && value > target && value <= target * 1.5;
  const isPoor = value !== undefined && value > target * 1.5;

  const getColor = () => {
    if (isGood) return 'text-green-600';
    if (isWarning) return 'text-yellow-600';
    if (isPoor) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBadgeVariant = () => {
    if (isGood) return 'default';
    if (isWarning) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="border rounded-lg p-4 text-center">
      <div className="flex items-center justify-center mb-2 text-muted-foreground">
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: getColor() }}>
        {value !== undefined ? value.toFixed(0) : 'N/A'}
        <span className="text-sm font-normal ml-1">{unit}</span>
      </div>
      <div className="text-sm font-medium mb-2">{title}</div>
      <Badge variant={getBadgeVariant()} className="text-xs">
        {isGood ? 'Good' : isWarning ? 'Warning' : 'Poor'}
      </Badge>
      <div className="text-xs text-muted-foreground mt-2">{description}</div>
    </div>
  );
}

interface HealthCheckItemProps {
  name: string;
  status: boolean;
  responseTime: number;
}

function HealthCheckItem({ name, status, responseTime }: HealthCheckItemProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-2">
        {status ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
      </div>
      <div className="font-medium">{name}</div>
      <div className="text-sm text-muted-foreground">
        {status ? 'Healthy' : 'Unhealthy'}
      </div>
      <div className="text-xs text-muted-foreground">
        {responseTime}ms
      </div>
    </div>
  );
}
