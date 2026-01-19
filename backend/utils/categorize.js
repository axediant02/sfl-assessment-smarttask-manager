/**
 * Auto-categorizes tasks based on keyword matching in title and description
 */
export function categorizeTask(title, description) {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  const categories = {
    Work: ['meeting', 'call', 'email', 'project', 'deadline', 'presentation', 'report', 'client', 'team', 'office', 'work', 'business'],
    Personal: ['personal', 'family', 'friend', 'home', 'house', 'personal'],
    Shopping: ['buy', 'purchase', 'grocery', 'shopping', 'store', 'market', 'shop'],
    Health: ['exercise', 'workout', 'gym', 'doctor', 'appointment', 'health', 'fitness', 'medication', 'vitamin'],
    Learning: ['study', 'learn', 'course', 'book', 'reading', 'tutorial', 'education', 'training'],
    Travel: ['travel', 'trip', 'flight', 'hotel', 'vacation', 'journey', 'destination'],
    Finance: ['bill', 'payment', 'invoice', 'budget', 'expense', 'tax', 'bank', 'money', 'finance']
  };

  // Count matches for each category
  const scores = {};
  for (const [category, keywords] of Object.entries(categories)) {
    scores[category] = keywords.filter(keyword => text.includes(keyword)).length;
  }

  // Find category with highest score
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) {
    return 'Other'; // Default category
  }

  const topCategory = Object.keys(scores).find(cat => scores[cat] === maxScore);
  return topCategory;
}
