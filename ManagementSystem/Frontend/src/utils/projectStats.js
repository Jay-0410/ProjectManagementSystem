/**
 * Utility functions for calculating project statistics
 */

export const calculateProjectStats = (projects) => {
  if (!projects || projects.length === 0) {
    return {
      total: 0,
      active: 0,
      completed: 0,
      onHold: 0,
      inProgress: 0,
      cancelled: 0,
      averageProgress: 0,
      highPriority: 0,
      overdue: 0,
      dueThisWeek: 0
    };
  }

  const total = projects.length;
  
  // Status counts with multiple status variations
  const active = projects.filter(p => 
    p.status === 'ACTIVE' || 
    p.status === 'IN_PROGRESS' || 
    p.status === 'ONGOING'
  ).length;
  
  const completed = projects.filter(p => 
    p.status === 'COMPLETED' || 
    p.status === 'DONE' || 
    p.status === 'FINISHED'
  ).length;
  
  const onHold = projects.filter(p => 
    p.status === 'ON_HOLD' || 
    p.status === 'PAUSED' || 
    p.status === 'SUSPENDED'
  ).length;
  
  const inProgress = projects.filter(p => 
    p.status === 'IN_PROGRESS' || 
    p.status === 'ONGOING'
  ).length;
  
  const cancelled = projects.filter(p => 
    p.status === 'CANCELLED' || 
    p.status === 'ARCHIVED' || 
    p.status === 'TERMINATED'
  ).length;

  // Average progress calculation with null safety
  const totalProgress = projects.reduce((sum, p) => {
    const progress = p.completionPercentage || p.progress || 0;
    return sum + progress;
  }, 0);
  const averageProgress = Math.round(totalProgress / total);

  // Priority counts
  const highPriority = projects.filter(p => 
    p.priority === 'HIGH' || 
    p.priority === 'CRITICAL' || 
    p.priority === 'URGENT'
  ).length;

  // Date-based calculations
  const now = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(now.getDate() + 7);

  const overdue = projects.filter(p => {
    if (!p.endDate) return false;
    const endDate = new Date(p.endDate);
    return endDate < now && p.status !== 'COMPLETED' && p.status !== 'DONE';
  }).length;

  const dueThisWeek = projects.filter(p => {
    if (!p.endDate) return false;
    const endDate = new Date(p.endDate);
    return endDate >= now && endDate <= oneWeekFromNow && p.status !== 'COMPLETED' && p.status !== 'DONE';
  }).length;

  return {
    total,
    active,
    completed,
    onHold,
    inProgress,
    cancelled,
    averageProgress,
    highPriority,
    overdue,
    dueThisWeek
  };
};

export const getProjectHealthScore = (projects) => {
  if (!projects || projects.length === 0) return 0;
  
  const stats = calculateProjectStats(projects);
  
  // Health score calculation (0-100)
  let score = 100;
  
  // Reduce score for overdue projects
  if (stats.overdue > 0) {
    score -= (stats.overdue / stats.total) * 30;
  }
  
  // Reduce score for low average progress
  if (stats.averageProgress < 50) {
    score -= (50 - stats.averageProgress) / 2;
  }
  
  // Reduce score for cancelled projects
  if (stats.cancelled > 0) {
    score -= (stats.cancelled / stats.total) * 20;
  }
  
  // Bonus for high completion rate
  const completionRate = stats.completed / stats.total;
  if (completionRate > 0.7) {
    score += 10;
  }
  
  return Math.max(0, Math.round(score));
};

export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'IN_PROGRESS':
    case 'ONGOING':
      return 'text-green-600 bg-green-100';
    case 'COMPLETED':
    case 'DONE':
    case 'FINISHED':
      return 'text-blue-600 bg-blue-100';
    case 'ON_HOLD':
    case 'PAUSED':
    case 'SUSPENDED':
      return 'text-yellow-600 bg-yellow-100';
    case 'CANCELLED':
    case 'ARCHIVED':
    case 'TERMINATED':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getPriorityColor = (priority) => {
  switch (priority?.toUpperCase()) {
    case 'HIGH':
    case 'CRITICAL':
    case 'URGENT':
      return 'text-red-600 bg-red-100';
    case 'MEDIUM':
    case 'NORMAL':
      return 'text-yellow-600 bg-yellow-100';
    case 'LOW':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const formatProjectStats = (stats) => {
  return {
    'Total Projects': stats.total,
    'Active Projects': stats.active,
    'Completed Projects': stats.completed,
    'Average Progress': `${stats.averageProgress}%`,
    'High Priority': stats.highPriority,
    'Overdue': stats.overdue,
    'Due This Week': stats.dueThisWeek
  };
};
