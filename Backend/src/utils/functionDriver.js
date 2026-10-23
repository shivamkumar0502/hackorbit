const normalizeLanguage = language => ({'c++':'cpp',cpp:'cpp',java:'java',javascript:'javascript'})[language?.toLowerCase()];
function buildSource(problem, code, language) {
 if (!problem.functionMode) return code;
 const key=normalizeLanguage(language), template=problem.driverCode?.[key];
 if (!template?.includes('__HACKORBIT_SOLUTION__')) throw Object.assign(new Error('The function driver is not configured for this language.'),{statusCode:422});
 // Preserve full-program drafts and old submissions from before the function upgrade.
 // New class snippets are always combined with the server-owned input/output driver.
 const fullProgram=key==='cpp'?/\bint\s+main\s*\(/.test(code):key==='java'?/\bstatic\s+void\s+main\s*\(/.test(code):/\b(?:readFileSync|process\.stdin)\b/.test(code);
 return fullProgram ? code : template.replace('__HACKORBIT_SOLUTION__',()=>code);
}
module.exports={buildSource,normalizeLanguage};
