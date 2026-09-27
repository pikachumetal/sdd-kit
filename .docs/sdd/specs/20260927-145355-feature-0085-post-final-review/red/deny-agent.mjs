// PreToolUse de los sujetos de la 0085: deniega los despachos. La tool call denegada sigue en el stream con su prompt,
// que es lo que se mide; sin el hook, cada sujeto pagaría un revisor entero.
console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: 'Despacho no disponible en esta campaña: el encargo queda registrado. Sigue sin él y di qué harías con su resultado.',
  },
}));
