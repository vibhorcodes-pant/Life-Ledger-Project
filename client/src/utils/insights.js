// Rule-based insight generation engine
export function generateInsights(data) {
  const insights = [];
  
  if (!data) return insights;

  // Study insights
  if (data.study) {
    if (data.study.thisWeek > data.study.lastWeek) {
      insights.push(`Great job! You studied ${Math.round(((data.study.thisWeek - data.study.lastWeek) / data.study.lastWeek) * 100)}% more this week compared to last week.`);
    }
    if (data.study.peakHour) {
      insights.push(`Your peak productivity hour is ${data.study.peakHour}. Try scheduling complex tasks then.`);
    }
  }

  // Health insights
  if (data.health) {
    if (data.health.avgSleep < 7) {
      insights.push("You've been averaging less than 7 hours of sleep. Try getting to bed 30 mins earlier.");
    }
    if (data.health.workoutsThisWeek >= 3) {
      insights.push("Consistent workouts! You've hit your exercise goal 3 times this week. Keep the momentum.");
    }
  }

  // Finance insights
  if (data.finance) {
    if (data.finance.spendingTrend > 0) {
      insights.push(`Spending is up ${data.finance.spendingTrend}% this month. Keep an eye on dining out.`);
    }
  }

  if (insights.length === 0) {
    insights.push("Keep logging data to get personalized insights about your habits and routines.");
  }

  return insights;
}

export function generateCorrelations(data) {
  const correlations = [];
  // Mock correlations for now
  correlations.push("Days with >7h sleep correlate with 20% higher study focus.");
  correlations.push("Working out in the morning usually leads to better mood scores.");
  return correlations;
}

export async function generateAIInsights(data, config = {}) {
  // Placeholder for future AI integration
  // For now, fall back to rule-based
  return generateInsights(data);
}
