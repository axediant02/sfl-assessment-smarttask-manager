/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, includeTime = true) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = 'numeric';
    options.minute = '2-digit';
    options.hour12 = true;
  }
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format date with time in a specific format: "Dec 25, 2024 at 3:00 PM"
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const datePart = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  return `${datePart} at ${timePart}`;
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export function getRelativeTime(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  const isPast = diffMs < 0;
  const absDiff = Math.abs(diffMs);
  
  if (absDiff < 60000) { // Less than 1 minute
    return isPast ? 'just now' : 'in a moment';
  } else if (absDiff < 3600000) { // Less than 1 hour
    const minutes = Math.abs(diffMinutes);
    return isPast ? `${minutes} minute${minutes !== 1 ? 's' : ''} ago` : `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (absDiff < 86400000) { // Less than 1 day
    const hours = Math.abs(diffHours);
    return isPast ? `${hours} hour${hours !== 1 ? 's' : ''} ago` : `in ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (absDiff < 604800000) { // Less than 1 week
    const days = Math.abs(diffDays);
    return isPast ? `${days} day${days !== 1 ? 's' : ''} ago` : `in ${days} day${days !== 1 ? 's' : ''}`;
  } else {
    // For longer periods, use formatted date
    return formatDate(dateString, false);
  }
}

/**
 * Check if a deadline is overdue
 * @param {string} deadlineString - ISO date string
 * @param {string} status - Task status
 * @returns {boolean} True if overdue
 */
export function isOverdue(deadlineString, status) {
  if (!deadlineString || status === 'Done') return false;
  
  const deadline = new Date(deadlineString);
  if (isNaN(deadline.getTime())) return false;
  
  return deadline < new Date();
}

/**
 * Check if a deadline is approaching (within 24 hours)
 * @param {string} deadlineString - ISO date string
 * @param {string} status - Task status
 * @returns {boolean} True if approaching
 */
export function isApproaching(deadlineString, status) {
  if (!deadlineString || status === 'Done') return false;
  
  const deadline = new Date(deadlineString);
  if (isNaN(deadline.getTime())) return false;
  
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // Approaching if within 24 hours and not overdue
  return diffHours > 0 && diffHours <= 24;
}

/**
 * Get days until deadline (negative if overdue)
 * @param {string} deadlineString - ISO date string
 * @returns {number} Days until deadline
 */
export function getDaysUntilDeadline(deadlineString) {
  if (!deadlineString) return null;
  
  const deadline = new Date(deadlineString);
  if (isNaN(deadline.getTime())) return null;
  
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Format deadline for display with relative time
 * @param {string} deadlineString - ISO date string
 * @param {string} status - Task status
 * @returns {string} Formatted deadline string
 */
export function formatDeadline(deadlineString, status) {
  if (!deadlineString) return '';
  
  if (status === 'Done') {
    return formatDateTime(deadlineString);
  }
  
  const relative = getRelativeTime(deadlineString);
  const formatted = formatDateTime(deadlineString);
  
  // For recent deadlines, show relative time; otherwise show full date
  const deadline = new Date(deadlineString);
  const now = new Date();
  const diffMs = Math.abs(deadline.getTime() - now.getTime());
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  if (diffDays < 7) {
    return `${formatted} (${relative})`;
  }
  
  return formatted;
}
