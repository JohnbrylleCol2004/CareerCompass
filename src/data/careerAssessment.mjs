export const AREAS = [
  ['programming', 'Programming'], ['web', 'Web development'], ['database', 'Database management'],
  ['networking', 'Networking'], ['security', 'Information security'], ['systems', 'Systems administration'],
  ['integration', 'Systems integration'], ['quality', 'Quality assurance'],
  ['analysis', 'Systems analysis'], ['support', 'Technical support'],
];

const roleAreas = [
  ['Web and Applications Developer', ['web', 'programming', 'database']],
  ['Junior Database Administrator', ['database', 'systems', 'security']],
  ['Systems Administrator', ['systems', 'networking', 'security']],
  ['Network Engineer', ['networking', 'systems', 'security']],
  ['Junior Information Security Administrator', ['security', 'networking', 'systems']],
  ['Systems Integration Personnel', ['integration', 'programming', 'systems']],
  ['IT Audit Assistant', ['security', 'analysis', 'quality']],
  ['Technical Support Specialist', ['support', 'systems', 'networking']],
  ['QA Specialist', ['quality', 'programming', 'analysis']],
  ['Systems Analyst', ['analysis', 'integration', 'database']],
  ['Computer Programmer', ['programming', 'quality', 'database']],
];

const points = { unassessed: 0, developing: 1, demonstrated: 2, strong: 3 };
export function isCompleteSet(items) {
  return Array.isArray(items) && items.length === 20 && items.every(item =>
    typeof item.question === 'string' && item.question.trim() && item.question.length <= 1000 &&
    typeof item.answer === 'string' && item.answer.trim() && item.answer.length <= 1200);
}

export function normalizeAssessment(value) {
  if (!Array.isArray(value?.areas) || value.areas.length !== AREAS.length) throw new Error('Assessment is incomplete. Please try again.');
  const seen = new Set();
  const areas = value.areas.map(item => {
    if (!AREAS.some(([id]) => id === item?.area) || seen.has(item.area) || !Object.hasOwn(points, item.level)
      || !Array.isArray(item.evidence) || item.evidence.length > 4
      || item.evidence.some(number => !Number.isInteger(number) || number < 1 || number > 20)
      || typeof item.note !== 'string' || !item.note.trim() || item.note.length > 220
      || (item.level === 'unassessed' && item.evidence.length > 0)
      || (item.level !== 'unassessed' && item.evidence.length === 0)) {
      throw new Error('Assessment is incomplete. Please try again.');
    }
    seen.add(item.area);
    return { area: item.area, level: item.level, evidence: [...new Set(item.evidence)], note: item.note.trim() };
  });
  return { version: 1, completedAt: new Date().toISOString(), areas };
}

export function rankCareers(assessment) {
  const byArea = Object.fromEntries(assessment.areas.map(area => [area.area, area]));
  return roleAreas.map(([name, ids], index) => {
    const supported = ids.filter(id => byArea[id] && byArea[id].level !== 'unassessed');
    const score = ids.reduce((total, id) => total + (points[byArea[id]?.level] || 0), 0);
    return { name, areas: ids, supported, score, index };
  }).filter(role => role.supported.length >= 2 && role.score >= 4)
    .sort((a, b) => b.score - a.score || b.supported.length - a.supported.length || a.index - b.index)
    .slice(0, 3);
}
