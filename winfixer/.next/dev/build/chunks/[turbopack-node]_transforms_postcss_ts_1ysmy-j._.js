module.exports = [
"[turbopack-node]/transforms/postcss.ts?config=[project]/winfixer/postcss.config.js { CONFIG => \"[project]/winfixer/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/1i1z_06fbjqp._.js",
  "chunks/[root-of-the-server]__1-iueso._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts?config=[project]/winfixer/postcss.config.js { CONFIG => \"[project]/winfixer/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];