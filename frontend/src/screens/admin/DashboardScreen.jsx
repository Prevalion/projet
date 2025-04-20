import React from 'react';
import { Grid, Typography, LinearProgress, Box, Paper } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { useGetDashboardStatsQuery } from '../../slices/dashboardApiSlice';
import { format } from 'date-fns';
import Meta from '../../components/Meta'; // Import Meta component

const DashboardScreen = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  // Make sure we have valid data before creating chart data arrays
  const salesData = stats && stats.monthlySales && stats.monthlySales.length > 0
    ? stats.monthlySales.map((sale, index) => ({
        month: format(new Date().setMonth(index), 'MMM'),
        total: sale.total || 0,
      }))
    : Array(12).fill(0).map((_, index) => ({
        month: format(new Date().setMonth(index), 'MMM'),
        total: 0,
      }));

  const productDistribution = stats && stats.productCategories && stats.productCategories.length > 0
    ? stats.productCategories.map(category => ({
        id: category._id || `category-${Math.random()}`,
        label: category.name || 'Unknown',
        value: category.count || 0,
      }))
    : [{ id: 'no-data', label: 'No Data', value: 1 }];

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Meta title="Admin: Dashboard" /> {/* Added Meta component */}
      {/* Key Metrics */}
      <Grid item container spacing={3} xs={12}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toFixed(3)}`}           
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
            progress={(stats?.monthlyOrders / (stats?.totalOrders || 1)) * 100 || 0}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Product Stock"
            value={stats?.lowStockProducts || 0}
            progress={(stats?.lowStockProducts / (stats?.totalProducts || 1)) * 100 || 0}
            color="#F44336"
            label="Low Stock Items"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Monthly Sales</Typography>
          {isLoading ? <LinearProgress /> : (
            <Box sx={{ height: 400 }}>
              {salesData.length > 0 && (
                <BarChart
                  dataset={salesData}
                  xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                  series={[{ dataKey: 'total', label: 'Revenue ($)' }]}
                  height={350}
                  margin={{ left: 70 }}
                />
              )}
            </Box>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Product Categories</Typography>
          {isLoading ? <LinearProgress /> : (
            <Box sx={{ height: 350, display: 'flex', justifyContent: 'center' }}>
              {productDistribution.length > 0 && (
                <PieChart
                  series={[{
                    data: productDistribution,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                  }]}
                  height={300}
                  slotProps={{
                    legend: { hidden: false },
                  }}
                />
              )}
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Recent Activities */}
      <Grid item xs={12}>
        <RecentActivities activities={stats?.recentActivities || []} />
      </Grid>
    </Grid>
  );
};

const MetricCard = ({ title, value, progress, color, label }) => (
  <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
    <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
    <Typography variant="h4" sx={{ my: 1, color }}>
      {value}
    </Typography>
    {/* Removed the Box containing LinearProgress and percentage Typography */}
    {/* If a specific label like "Low Stock Items" is provided, display it */}
    {label && (
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        {label}
      </Typography>
    )}
  </Paper>
);

const RecentActivities = ({ activities }) => (
  <Paper sx={{ p: 2, borderRadius: 2 }}>
    <Typography variant="h6" gutterBottom>Recent Activities</Typography>
    {activities && activities.length > 0 ? (
      activities.map((activity, index) => (
        <Box key={index} sx={{ 
          display: 'flex',
          alignItems: 'center',
          py: 1,
          borderBottom: index < activities.length - 1 ? '1px solid #eee' : 'none'
        }}>
          <Box sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: activity.type === 'order' ? '#4CAF50' : '#2196F3',
            mr: 2
          }} />
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {activity.message}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {activity.timestamp ? format(new Date(activity.timestamp), 'PPpp') : 'Unknown date'}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography color="textSecondary">No recent activities</Typography>
    )}
  </Paper>
);

export default DashboardScreen;