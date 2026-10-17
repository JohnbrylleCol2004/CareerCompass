const text = (maxLength = 1500) => ({ type: 'string', minLength: 1, maxLength });
const list = (maxItems = 5) => ({ type: 'array', items: text(), maxItems });
const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const score = maximum => ({ type: 'integer', minimum: 0, maximum });

export const schemas = {
  interview_questions: object({ questions: { type: 'array', minItems: 5, maxItems: 5,
    items: object({ question: text(1000), category: text(100) }) } }),
  interview_feedback: object({ score: score(10), summary: text(), strengths: list(3), improvements: list(3), sampleAnswer: text(4000) }),
  resume_analysis: object({ isResume: { type: 'boolean' }, score: score(100), summary: text(),
    strengths: list(), improvements: list(), missingSections: list(), skills: list(20), suggestedRoles: list(5), exampleBullet: text(2000) }),
};

// Gemini accepts a JSON Schema subset; enforce string lengths locally as well.
export function geminiSchema(schema) {
  if (Array.isArray(schema)) return schema.map(geminiSchema);
  if (!schema || typeof schema !== 'object') return schema;
  return Object.fromEntries(Object.entries(schema)
    .filter(([key]) => !['minLength', 'maxLength'].includes(key))
    .map(([key, value]) => [key, geminiSchema(value)]));
}

// Validate structured responses too: no malformed or incomplete output reaches the UI.
export function matchesSchema(value, schema) {
  if (schema.type === 'object') return !!value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === schema.required.length
    && schema.required.every(key => matchesSchema(value[key], schema.properties[key]));
  if (schema.type === 'array') return Array.isArray(value) && value.length >= (schema.minItems || 0)
    && value.length <= schema.maxItems && value.every(item => matchesSchema(item, schema.items));
  if (schema.type === 'string') return typeof value === 'string' && value.trim().length >= schema.minLength && value.length <= schema.maxLength;
  if (schema.type === 'integer') return Number.isInteger(value) && value >= schema.minimum && value <= schema.maximum;
  return schema.type === 'boolean' && typeof value === 'boolean';
}
