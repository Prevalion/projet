import React from 'react';
import { Grid, Typography, LinearProgress } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { useGetDashboardStatsQuery } from '../../slices/dashboardApiSlice';
import { format } from 'date-fns';

const DashboardScreen = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  const salesData = stats?.monthlySales.map((sale, index) => ({
    month: format(new Date().setMonth(index), 'MMM'),
    total: sale.total,
  })) || [];

  const productDistribution = stats?.productCategories.map(category => ({
    id: category._id,
    label: category.name,
    value: category.count,
  })) || [];

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Key Metrics */}
      <Grid item container spacing={3} xs={12}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Revenue"
            value={`$${stats?.totalRevenue || 0}`}
            progress={100}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            progress={stats?.userGrowth || 0}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Orders This Month"
            value={stats?.monthlyOrders || 0}
            progress={(stats?.monthlyOrders / stats?.totalOrders) * 100 || 0}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Product Stock"
            value={stats?.lowStockProducts || 0}
            progress={(stats?.lowStockProducts / stats?.totalProducts) * 100 || 0}
            color="#F44336"
            label="Low Stock Items"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>Monthly Sales</Typography>
        {isLoading ? <LinearProgress /> : (
          <BarChart
            dataset={salesData}
            xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
            series={[{ dataKey: 'total', label: 'Revenue ($)' }]}
            height={400}
            margin={{ left: 70 }}
          />
        )}
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>Product Categories</Typography>
        {isLoading ? <LinearProgress /> : (
          <PieChart
            series={[{
              data: productDistribution,
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
            }]}
            width={400}
            height={300}
            slotProps={{
              legend: { hidden: true },
            }}
          />
        )}
      </Grid>

      {/* Recent Activities */}
      <Grid item xs={12}>
        <RecentActivities activities={stats?.recentActivities} />
      </Grid>
    </Grid>
  );
};

const MetricCard = ({ title, value, progress, color, label }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }}>
    <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
    <Typography variant="h4" style={{ margin: '8px 0', color }}>
      {value}
    </Typography>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        style={{ flexGrow: 1, marginRight: '8px', height: '6px' }}
      />
      <Typography variant="body2">{label || `${Math.round(progress)}%`}</Typography>
    </div>
  </div>
);

const RecentActivities = ({ activities }) => (
  <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px' }}>
    <Typography variant="h6" gutterBottom>Recent Activities</Typography>
    {activities?.map((activity, index) => (
      <div key={index} style={{ 
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: index < activities.length - 1 ? '1px solid #eee' : 'none'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: activity.type === 'order' ? '#4CAF50' : '#2196F3',
          marginRight: '16px'
        }} />
        <Typography variant="body2" style={{ flexGrow: 1 }}>
          {activity.message}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {format(new Date(activity.timestamp), 'PPpp')}
        </Typography>
      </div>
    )) || <Typography color="textSecondary">No recent activities</Typography>}
  </div>
);

export default DashboardScreen;