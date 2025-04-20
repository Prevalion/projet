import React from 'react';
import { 
  Grid, 
  Typography, 
  LinearProgress, 
  Box, 
  Paper, 
  Card, 
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs
} from '@mui/material';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';
import { useGetDashboardStatsQuery } from '../../slices/dashboardApiSlice';
import { format, subDays } from 'date-fns';
import Meta from '../../components/Meta';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const DashboardScreen = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Make sure we have valid data before creating chart data arrays
  const salesData = stats && stats.monthlySales && stats.monthlySales.length > 0
    ? stats.monthlySales.map((sale, index) => ({
        month: format(new Date().setMonth(index), 'MMM'),
        total: sale.total || 0,
        orders: sale.count || 0
      }))
    : Array(12).fill(0).map((_, index) => ({
        month: format(new Date().setMonth(index), 'MMM'),
        total: 0,
        orders: 0
      }));

  const productDistribution = stats && stats.productCategories && stats.productCategories.length > 0
    ? stats.productCategories.map(category => ({
        id: category._id || `category-${Math.random()}`,
        label: category._id || 'Unknown',
        value: category.count || 0,
      }))
    : [{ id: 'no-data', label: 'No Data', value: 1 }];

  // Daily sales data for the last 30 days (simulated)
  const dailySalesData = Array(30).fill(0).map((_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM dd'),
    sales: Math.floor(Math.random() * 1000) + 500,
    visitors: Math.floor(Math.random() * 100) + 50
  }));

  // Calculate growth rates
  const currentMonthSales = salesData[new Date().getMonth()]?.total || 0;
  const previousMonthSales = salesData[new Date().getMonth() - 1 < 0 ? 11 : new Date().getMonth() - 1]?.total || 1;
  const salesGrowth = ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <Meta title="Admin: Dashboard" />
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Dashboard
      </Typography>
      
      {isLoading ? (
        <LinearProgress />
      ) : error ? (
        <Typography color="error">Error loading dashboard data</Typography>
      ) : (
        <>
          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Revenue"
                value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
                icon={<AttachMoneyIcon fontSize="large" />}
                color="#4CAF50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Active Users"
                value={stats?.activeUsers || 0}
                icon={<PersonIcon fontSize="large" />}
                color="#2196F3"
                subtitle={`${stats?.totalUsers || 0} total users`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Monthly Sales"
                value={currentMonthSales.toLocaleString()}
                icon={<ShoppingCartIcon fontSize="large" />}
                color="#FF9800"
                trend={salesGrowth}
                trendLabel={`${Math.abs(salesGrowth).toFixed(1)}% ${salesGrowth >= 0 ? 'increase' : 'decrease'}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Low Stock Items"
                value={stats?.lowStockProducts || 0}
                icon={<InventoryIcon fontSize="large" />}
                color="#F44336"
                subtitle={`${stats?.totalProducts || 0} total products`}
              />
            </Grid>
          </Grid>
          
          {/* Tabs for different chart views */}
          <Box sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Sales Overview" />
              <Tab label="Product Analysis" />
              <Tab label="User Activity" />
            </Tabs>
          </Box>
          
          {/* Tab Content */}
          <Box sx={{ mb: 4 }}>
            {/* Sales Overview Tab */}
            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Monthly Revenue</Typography>
                    <Box sx={{ height: 400 }}>
                      <BarChart
                        dataset={salesData}
                        xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                        series={[{ dataKey: 'total', label: 'Revenue ($)' }]}
                        height={350}
                        margin={{ left: 70 }}
                      />
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>Sales Distribution</Typography>
                    <Box sx={{ height: 350, display: 'flex', justifyContent: 'center' }}>
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
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Daily Sales (Last 30 Days)</Typography>
                    <Box sx={{ height: 400 }}>
                      <LineChart
                        dataset={dailySalesData}
                        xAxis={[{ dataKey: 'date', scaleType: 'band' }]}
                        series={[
                          { dataKey: 'sales', label: 'Sales ($)', color: '#4CAF50' },
                          { dataKey: 'visitors', label: 'Visitors', color: '#2196F3' }
                        ]}
                        height={350}
                      />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {/* Product Analysis Tab */}
            {tabValue === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Product Categories</Typography>
                    <Box sx={{ height: 350 }}>
                      <PieChart
                        series={[{
                          data: productDistribution,
                          innerRadius: 30,
                          outerRadius: 100,
                          paddingAngle: 5,
                          cornerRadius: 5,
                        }]}
                        height={300}
                      />
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
                    <List>
                      {/* Simulated top products - replace with actual data */}
                      {[1, 2, 3, 4, 5].map((item) => (
                        <ListItem key={item} divider>
                          <ListItemText 
                            primary={`Product ${item}`} 
                            secondary={`${Math.floor(Math.random() * 100) + 10} units sold`} 
                          />
                          <Typography variant="body2" color="primary">
                            ${(Math.random() * 100 + 50).toFixed(2)}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            )}
            
            {/* User Activity Tab */}
            {tabValue === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>User Growth</Typography>
                    <Box sx={{ height: 350 }}>
                      {/* Simulated user growth chart */}
                      <LineChart
                        dataset={Array(12).fill(0).map((_, i) => ({
                          month: format(new Date().setMonth(i), 'MMM'),
                          users: Math.floor(Math.random() * 50) + (i * 10)
                        }))}
                        xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
                        series={[{ dataKey: 'users', label: 'New Users', color: '#2196F3' }]}
                        height={300}
                      />
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Recent User Activity</Typography>
                    <List>
                      {/* Simulated user activity - replace with actual data */}
                      {stats?.recentActivities?.slice(0, 5).map((activity, index) => (
                        <ListItem key={index} divider>
                          <ListItemIcon>
                            {activity.type === 'user' ? <PersonIcon /> : <ShoppingCartIcon />}
                          </ListItemIcon>
                          <ListItemText 
                            primary={activity.message} 
                            secondary={format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
          
          {/* Recent Activities */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                <List>
                  {stats?.recentActivities?.map((activity, index) => (
                    <ListItem key={index} divider={index < stats.recentActivities.length - 1}>
                      <ListItemIcon>
                        {activity.type === 'user' ? <PersonIcon /> : <ShoppingCartIcon />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={activity.message} 
                        secondary={format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon, color, subtitle, trend, trendLabel }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ color: color }}>
            {icon}
          </Box>
        </Box>
        
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        
        {trend !== undefined && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: trend >= 0 ? 'success.main' : 'error.main',
            mt: 1
          }}>
            {trend >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {trendLabel}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardScreen;