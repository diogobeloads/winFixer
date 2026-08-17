module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/winfixer/app/api/diagnose/complete/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/winfixer/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/winfixer/lib/supabase/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/winfixer/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
;
;
const completeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    sessionId: __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid()
});
function normalizeAnswer(value) {
    if (value === null || value === undefined) {
        return '';
    }
    return String(value).trim().toLowerCase();
}
function extractAnswers(rawAnswers) {
    if (rawAnswers && typeof rawAnswers === 'object' && !Array.isArray(rawAnswers)) {
        return rawAnswers;
    }
    if (Array.isArray(rawAnswers)) {
        const result = {};
        for (const item of rawAnswers){
            if (!item || typeof item !== 'object') {
                continue;
            }
            const entry = item;
            const questionId = entry.question_id ?? entry.questionId ?? entry.id;
            const answer = entry.answer ?? entry.answer_value ?? entry.answerValue ?? entry.value;
            if (questionId !== undefined && answer !== undefined) {
                result[String(questionId)] = answer;
            }
        }
        return result;
    }
    return {};
}
async function POST(request) {
    try {
        /*
     * ============================================================
     * 1. VALIDAR REQUEST
     * ============================================================
     */ const body = await request.json();
        const validationResult = completeSchema.safeParse(body);
        if (!validationResult.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sessão de diagnóstico inválida.'
            }, {
                status: 400
            });
        }
        const { sessionId } = validationResult.data;
        console.log('========================================');
        console.log('COMPLETE DIAGNOSIS:', sessionId);
        /*
     * ============================================================
     * 2. BUSCAR SESSÃO
     * ============================================================
     */ const { data: session, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('diagnostic_sessions').select('*').eq('id', sessionId).single();
        if (sessionError) {
            console.error('SESSION FETCH ERROR:', sessionError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não foi possível carregar a sessão de diagnóstico.'
            }, {
                status: 500
            });
        }
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Sessão de diagnóstico não encontrada.'
            }, {
                status: 404
            });
        }
        console.log('SESSION DATA:', session);
        /*
     * ============================================================
     * 3. NORMALIZAR RESPOSTAS
     * ============================================================
     */ const answers = extractAnswers(session.answers);
        console.log('DIAGNOSTIC ANSWERS:', answers);
        console.log('ANSWER KEYS:', Object.keys(answers));
        console.log('ANSWER VALUES:', Object.values(answers));
        console.log('SESSION CONTEXT:', session.context_id);
        if (Object.keys(answers).length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Nenhuma resposta foi registrada para esta sessão.'
            }, {
                status: 400
            });
        }
        /*
     * ============================================================
     * 4. BUSCAR REGRAS
     *
     * IMPORTANTE:
     * Neste momento removemos temporariamente o filtro
     * "status = published".
     *
     * O objetivo é descobrir se o problema está no filtro
     * ou na consulta ao Supabase.
     * ============================================================
     */ console.log('========================================');
        console.log('SEARCHING DIAGNOSTIC RULES');
        console.log('CONTEXT ID USED:', session.context_id);
        const { data: rules, error: rulesError } = await __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('diagnostic_rules').select('*').eq('context_id', session.context_id).order('priority', {
            ascending: true
        });
        console.log('RULES WITHOUT STATUS FILTER:', rules);
        console.log('RULES QUERY ERROR:', rulesError);
        /*
     * ============================================================
     * 5. TRATAMENTO DE ERRO DAS REGRAS
     * ============================================================
     */ if (rulesError) {
            console.error('RULES FETCH ERROR:', rulesError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não foi possível consultar as regras de diagnóstico.'
            }, {
                status: 500
            });
        }
        /*
     * ============================================================
     * 6. VERIFICAR SE EXISTEM REGRAS
     * ============================================================
     */ if (!rules || rules.length === 0) {
            console.warn('NO RULES FOUND FOR CONTEXT:', session.context_id);
            return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                diagnosis: null,
                fix: null,
                message: 'Nenhuma regra de diagnóstico foi encontrada para este contexto.',
                debug: {
                    sessionId,
                    contextId: session.context_id,
                    answers,
                    rulesFound: 0
                }
            });
        }
        /*
     * ============================================================
     * 7. ENCONTRAR REGRA COMPATÍVEL
     * ============================================================
     */ let matchedRule = null;
        for (const rule of rules){
            const questionId = String(rule.question_id);
            const answer = answers[questionId];
            console.log('========================================');
            console.log('RULE CHECK:', {
                ruleId: rule.id,
                questionId,
                answer,
                expected: rule.answer_value,
                status: rule.status,
                contextId: rule.context_id,
                fixId: rule.fix_id,
                priority: rule.priority,
                normalizedAnswer: normalizeAnswer(answer),
                normalizedExpected: normalizeAnswer(rule.answer_value)
            });
            if (answer !== undefined && normalizeAnswer(answer) === normalizeAnswer(rule.answer_value)) {
                matchedRule = rule;
                console.log('MATCH FOUND:', matchedRule);
                break;
            }
        }
        console.log('========================================');
        console.log('MATCHED RULE:', matchedRule);
        /*
     * ============================================================
     * 8. NENHUMA REGRA COMPATÍVEL
     * ============================================================
     */ if (!matchedRule) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                diagnosis: null,
                fix: null,
                message: 'Ainda não encontramos uma solução específica para suas respostas.',
                debug: {
                    sessionId,
                    contextId: session.context_id,
                    answers,
                    rulesFound: rules.length,
                    rules: rules.map((rule)=>({
                            id: rule.id,
                            question_id: rule.question_id,
                            answer_value: rule.answer_value,
                            context_id: rule.context_id,
                            status: rule.status,
                            fix_id: rule.fix_id
                        }))
                }
            });
        }
        /*
     * ============================================================
     * 9. BUSCAR FIX
     * ============================================================
     */ console.log('SEARCHING FIX:', matchedRule.fix_id);
        const { data: fix, error: fixError } = await __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('fixes').select('*').eq('id', matchedRule.fix_id).single();
        console.log('FIX RESULT:', fix);
        console.log('FIX ERROR:', fixError);
        if (fixError) {
            console.error('FIX FETCH ERROR:', fixError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não foi possível carregar a solução recomendada.'
            }, {
                status: 500
            });
        }
        if (!fix) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'A solução recomendada não foi encontrada.'
            }, {
                status: 404
            });
        }
        /*
     * ============================================================
     * 10. FINALIZAR SESSÃO
     * ============================================================
     */ const { data: updatedSession, error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('diagnostic_sessions').update({
            status: 'completed'
        }).eq('id', sessionId).select('*').single();
        if (updateError) {
            console.error('SESSION UPDATE ERROR:', updateError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Não foi possível finalizar o diagnóstico.'
            }, {
                status: 500
            });
        }
        /*
     * ============================================================
     * 11. RETORNAR RESULTADO
     * ============================================================
     */ return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            diagnosis: {
                title: 'Possível causa identificada',
                summary: 'Suas respostas indicam um caminho provável para resolver o problema.'
            },
            fix,
            rule: matchedRule,
            session: updatedSession
        });
    } catch (error) {
        console.error('COMPLETE DIAGNOSIS ERROR:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : 'Erro inesperado ao concluir o diagnóstico.'
        }, {
            status: 500
        });
    }
}
}),
"[project]/winfixer/lib/supabase/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/winfixer/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://vlgniveapfmaqqmnzimm.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_Q5qL7Efa8lUC8P468goS-Q_dwnkv7BK");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
let supabaseInstance;
if ("TURBOPACK compile-time truthy", 1) {
    supabaseInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$winfixer$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
} else //TURBOPACK unreachable
;
const supabase = supabaseInstance;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1pa1xld._.js.map