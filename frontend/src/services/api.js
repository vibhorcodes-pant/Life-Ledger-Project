const API_BASE = '/api';

export async function fetchDashboard(date) {
  const url = date ? `${API_BASE}/dashboard?date=${date}` : `${API_BASE}/dashboard/today`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
}

export async function quickAddWater(amountMl) {
  const res = await fetch(`${API_BASE}/hydration/quick-add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountMl })
  });
  if (!res.ok) throw new Error('Failed to log water');
  return res.json();
}

export async function toggleHabit(habitId) {
  const res = await fetch(`${API_BASE}/habits/${habitId}/toggle`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to toggle habit');
  return res.json();
}

export async function createHabit(habitData) {
  const res = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habitData)
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
}

export async function logActivity(activityData) {
  const res = await fetch(`${API_BASE}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData)
  });
  if (!res.ok) throw new Error('Failed to log activity');
  return res.json();
}

export async function deleteActivity(id) {
  const res = await fetch(`${API_BASE}/activities/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete activity');
}

export async function logMeal(mealData) {
  const res = await fetch(`${API_BASE}/meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mealData)
  });
  if (!res.ok) throw new Error('Failed to log meal');
  return res.json();
}

export async function deleteMeal(id) {
  const res = await fetch(`${API_BASE}/meals/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete meal');
}

export async function recordSleep(sleepData) {
  const res = await fetch(`${API_BASE}/sleep`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sleepData)
  });
  if (!res.ok) throw new Error('Failed to record sleep');
  return res.json();
}

export async function updateSteps(steps) {
  const res = await fetch(`${API_BASE}/dashboard/steps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ steps })
  });
  if (!res.ok) throw new Error('Failed to update steps');
}
