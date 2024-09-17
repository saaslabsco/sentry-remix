Object.defineProperty(exports, '__esModule', { value: true });

const vercelEdge = require('@sentry/vercel-edge');



Object.prototype.hasOwnProperty.call(vercelEdge, '__proto__') &&
	!Object.prototype.hasOwnProperty.call(exports, '__proto__') &&
	Object.defineProperty(exports, '__proto__', {
		enumerable: true,
		value: vercelEdge['__proto__']
	});

Object.keys(vercelEdge).forEach(k => {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = vercelEdge[k];
});
//# sourceMappingURL=index.edge.js.map
