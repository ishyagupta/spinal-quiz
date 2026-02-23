(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/pages/index.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const questions = [
    {
        id: 1,
        text: "The spinal cord begins at the level of the:",
        options: [
            "Foramen magnum",
            "Atlas",
            "C3 vertebra",
            "Medulla oblongata only"
        ],
        correctIndex: 0
    },
    {
        id: 2,
        text: "The spinal cord ends at the level of the:",
        options: [
            "Sacrum",
            "First and second lumbar vertebrae",
            "Coccyx",
            "T12 vertebra"
        ],
        correctIndex: 1
    },
    {
        id: 3,
        text: "A thickening of the spinal cord that gives rise to nerves of the upper limbs is called the:",
        options: [
            "Lumbar enlargement",
            "Cervical enlargement",
            "Thoracic enlargement",
            "Brachial enlargement"
        ],
        correctIndex: 1
    },
    {
        id: 4,
        text: "The enlargement that supplies nerves to the lower limbs is the:",
        options: [
            "Cervical enlargement",
            "Sacral enlargement",
            "Lumbar enlargement",
            "Thoracic enlargement"
        ],
        correctIndex: 2
    },
    {
        id: 5,
        text: "In longitudinal view, the spinal cord tapers to a cone-shaped structure called the:",
        options: [
            "Cauda equina",
            "Conus medullaris",
            "Filum terminale",
            "Dorsal root"
        ],
        correctIndex: 1
    },
    {
        id: 6,
        text: "The bundle of spinal nerves extending inferiorly from the end of the spinal cord is called the:",
        options: [
            "Cauda equina",
            "Filum terminale",
            "Dorsal root ganglion",
            "Spinal fascicle"
        ],
        correctIndex: 0
    },
    {
        id: 7,
        text: "How many pairs of spinal nerves arise from the spinal cord?",
        options: [
            "21",
            "24",
            "31",
            "33"
        ],
        correctIndex: 2
    },
    {
        id: 8,
        text: "Spinal nerves belong to which division of the nervous system?",
        options: [
            "Central nervous system",
            "Peripheral nervous system",
            "Autonomic nervous system only",
            "Somatic nervous system only"
        ],
        correctIndex: 1
    },
    {
        id: 9,
        text: "The space between the dura mater and the vertebral bone that contains fat and loose connective tissue is the:",
        options: [
            "Subarachnoid space",
            "Subdural space",
            "Epidural space",
            "Ventricular space"
        ],
        correctIndex: 2
    },
    {
        id: 10,
        text: "Cerebrospinal fluid around the spinal cord is located mainly in the:",
        options: [
            "Epidural space",
            "Subdural space",
            "Subarachnoid space",
            "Peridural cavity"
        ],
        correctIndex: 2
    },
    {
        id: 11,
        text: "Which is the outermost meningeal layer surrounding the brain and spinal cord?",
        options: [
            "Arachnoid mater",
            "Dura mater",
            "Pia mater",
            "Epineurium"
        ],
        correctIndex: 1
    },
    {
        id: 12,
        text: "The thin, web-like meningeal layer without blood vessels is the:",
        options: [
            "Dura mater",
            "Pia mater",
            "Arachnoid mater",
            "Epimysium"
        ],
        correctIndex: 2
    },
    {
        id: 13,
        text: "The meningeal layer that closely follows the contours of the brain and spinal cord and contains many blood vessels is the:",
        options: [
            "Dura mater",
            "Arachnoid mater",
            "Pia mater",
            "Endoneurium"
        ],
        correctIndex: 2
    },
    {
        id: 14,
        text: "The space between the dura mater and arachnoid mater is the:",
        options: [
            "Subarachnoid space",
            "Subdural space",
            "Epidural space",
            "Ventricular space"
        ],
        correctIndex: 1
    },
    {
        id: 15,
        text: "A subdural hematoma is a collection of blood:",
        options: [
            "Between dura and pia mater",
            "Within the ventricles",
            "Between dura mater and arachnoid mater",
            "Between arachnoid and pia mater"
        ],
        correctIndex: 2
    },
    {
        id: 16,
        text: "Which meningeal layer continues into the vertebral canal as a strong tubular sheath surrounding the spinal cord?",
        options: [
            "Pia mater",
            "Arachnoid mater",
            "Dura mater",
            "Perineurium"
        ],
        correctIndex: 2
    },
    {
        id: 17,
        text: "In cross-section, the meninges covering the spinal cord from outermost to innermost are:",
        options: [
            "Dura mater → pia mater → arachnoid mater",
            "Arachnoid mater → dura mater → pia mater",
            "Dura mater → arachnoid mater → pia mater",
            "Pia mater → arachnoid mater → dura mater"
        ],
        correctIndex: 2
    },
    {
        id: 18,
        text: "The clear, watery fluid that bathes the brain and spinal cord and fills the subarachnoid space is:",
        options: [
            "Synovial fluid",
            "Cerebrospinal fluid",
            "Interstitial fluid",
            "Plasma"
        ],
        correctIndex: 1
    },
    {
        id: 19,
        text: "In the vertebral canal, which structure cushions and protects the spinal cord from the bony vertebrae?",
        options: [
            "Subdural space",
            "Subarachnoid space",
            "Epidural space filled with fat",
            "Central canal"
        ],
        correctIndex: 2
    },
    {
        id: 20,
        text: "Infection or inflammation of the meninges is called:",
        options: [
            "Encephalitis",
            "Meningitis",
            "Neuritis",
            "Myelitis"
        ],
        correctIndex: 1
    },
    {
        id: 21,
        text: "In a cross-section, the butterfly-shaped region in the center of the spinal cord is:",
        options: [
            "White matter",
            "Gray matter",
            "Meninges",
            "Epidural fat"
        ],
        correctIndex: 1
    },
    {
        id: 22,
        text: "The outer region surrounding the butterfly-shaped center in a spinal cord cross-section is:",
        options: [
            "Gray matter",
            "White matter",
            "Pia mater",
            "Arachnoid mater"
        ],
        correctIndex: 1
    },
    {
        id: 23,
        text: "The gray matter in the spinal cord is primarily composed of:",
        options: [
            "Myelinated axons",
            "Neuronal cell bodies and dendrites",
            "Meningeal layers",
            "Blood vessels only"
        ],
        correctIndex: 1
    },
    {
        id: 24,
        text: "The white matter in the spinal cord consists mainly of:",
        options: [
            "Unmyelinated cell bodies",
            "Bone tissue",
            "Myelinated axons forming tracts",
            "Dendrites only"
        ],
        correctIndex: 2
    },
    {
        id: 25,
        text: "In cross-section, the posterior projections of gray matter are called:",
        options: [
            "Anterior horns",
            "Lateral horns",
            "Posterior horns",
            "Gray commissures"
        ],
        correctIndex: 2
    },
    {
        id: 26,
        text: "The anterior projections of gray matter are known as:",
        options: [
            "Posterior horns",
            "Lateral horns",
            "Medial horns",
            "Anterior horns"
        ],
        correctIndex: 3
    },
    {
        id: 27,
        text: "The bar of gray matter that connects the two sides of the gray “butterfly” is the:",
        options: [
            "Gray commissure",
            "White commissure",
            "Central canal",
            "Funiculus"
        ],
        correctIndex: 0
    },
    {
        id: 28,
        text: "The small channel running through the center of the gray commissure that contains cerebrospinal fluid is the:",
        options: [
            "Epidural canal",
            "Central canal",
            "Vertebral canal",
            "Spinal sinus"
        ],
        correctIndex: 1
    },
    {
        id: 29,
        text: "The white matter is divided into anterior, lateral, and posterior regions known as:",
        options: [
            "Horns",
            "Funiculi (columns)",
            "Meninges",
            "Ganglia"
        ],
        correctIndex: 1
    },
    {
        id: 30,
        text: "Bundles of myelinated axons in the white matter that carry information up or down the spinal cord are called:",
        options: [
            "Tracts",
            "Nuclei",
            "Ganglia",
            "Nodes"
        ],
        correctIndex: 0
    },
    {
        id: 31,
        text: "The structure containing cell bodies of sensory neurons just outside the spinal cord is the:",
        options: [
            "Ventral root",
            "Dorsal root",
            "Dorsal root ganglion",
            "Central canal"
        ],
        correctIndex: 2
    },
    {
        id: 32,
        text: "Which root of a spinal nerve carries sensory (afferent) impulses into the spinal cord?",
        options: [
            "Ventral root",
            "Dorsal root",
            "Lateral root",
            "Median root"
        ],
        correctIndex: 1
    },
    {
        id: 33,
        text: "Which root carries motor (efferent) impulses out of the spinal cord to muscles or glands?",
        options: [
            "Ventral root",
            "Dorsal root",
            "Posterior root",
            "Ganglionic root"
        ],
        correctIndex: 0
    },
    {
        id: 34,
        text: "A spinal nerve is formed by the union of:",
        options: [
            "Two dorsal roots",
            "Two ventral roots",
            "A dorsal and a ventral root",
            "Two dorsal root ganglia"
        ],
        correctIndex: 2
    },
    {
        id: 35,
        text: "Spinal nerves are described functionally as:",
        options: [
            "Purely sensory",
            "Purely motor",
            "Autonomic only",
            "Mixed (both sensory and motor)"
        ],
        correctIndex: 3
    },
    {
        id: 36,
        text: "In the connective tissue of a nerve, the layer that surrounds an entire nerve is the:",
        options: [
            "Endoneurium",
            "Perineurium",
            "Epineurium",
            "Myelin sheath"
        ],
        correctIndex: 2
    },
    {
        id: 37,
        text: "The connective tissue that surrounds each fascicle (bundle) of axons is the:",
        options: [
            "Endoneurium",
            "Perineurium",
            "Epineurium",
            "Dura mater"
        ],
        correctIndex: 1
    },
    {
        id: 38,
        text: "The delicate connective tissue that surrounds each individual nerve fiber is the:",
        options: [
            "Endoneurium",
            "Perineurium",
            "Epineurium",
            "Arachnoid mater"
        ],
        correctIndex: 0
    },
    {
        id: 39,
        text: "Nerves that conduct impulses toward the brain or spinal cord are called:",
        options: [
            "Motor nerves",
            "Sensory nerves",
            "Mixed nerves",
            "Autonomic nerves"
        ],
        correctIndex: 1
    },
    {
        id: 40,
        text: "Nerves that carry impulses from the CNS to muscles or glands are:",
        options: [
            "Sensory nerves",
            "Motor nerves",
            "Mixed nerves",
            "Interneurons"
        ],
        correctIndex: 1
    },
    {
        id: 41,
        text: "Nerves that contain both sensory and motor fibers are called:",
        options: [
            "Mixed nerves",
            "Reflex nerves",
            "Spinal tracts",
            "Motor units"
        ],
        correctIndex: 0
    },
    {
        id: 42,
        text: "A pathway that begins at receptors, travels via sensory neurons to the CNS, and then via motor neurons to effectors is called a:",
        options: [
            "Corticospinal tract",
            "Reflex arc",
            "Pyramidal tract",
            "Extrapyramidal pathway"
        ],
        correctIndex: 1
    },
    {
        id: 43,
        text: "Ascending tracts in the spinal cord primarily carry:",
        options: [
            "Motor impulses to muscles",
            "Sensory information to the brain",
            "Autonomic signals to glands only",
            "CSF between ventricles"
        ],
        correctIndex: 1
    },
    {
        id: 44,
        text: "Descending tracts in the spinal cord primarily carry:",
        options: [
            "Sensory information to the brain",
            "Pain only",
            "Motor commands from brain to effectors",
            "Reflexes to the skin"
        ],
        correctIndex: 2
    },
    {
        id: 45,
        text: "Reflexes are best described as:",
        options: [
            "Slow, voluntary responses to stimuli",
            "Fast, predictable, involuntary responses to stimuli",
            "Unpredictable emotional reactions",
            "Conscious motor actions only"
        ],
        correctIndex: 1
    },
    {
        id: 46,
        text: "In the patellar (knee-jerk) reflex, the sensory neuron synapses with:",
        options: [
            "Another sensory neuron",
            "A motor neuron in the spinal cord",
            "A neuron in the brainstem only",
            "A skeletal muscle cell"
        ],
        correctIndex: 1
    },
    {
        id: 47,
        text: "The simplest reflex pathway involves which of the following?",
        options: [
            "Receptor → sensory neuron → CNS → motor neuron → effector",
            "Receptor → CNS → effector only",
            "Receptor → motor neuron → effector",
            "Receptor → interneuron → effector"
        ],
        correctIndex: 0
    },
    {
        id: 48,
        text: "A withdrawal reflex (stepping on a tack) is protective because it:",
        options: [
            "Always increases blood pressure",
            "Moves the body part away from painful stimulus before conscious awareness",
            "Requires conscious thought before action",
            "Only affects smooth muscle"
        ],
        correctIndex: 1
    },
    {
        id: 49,
        text: "In a withdrawal reflex, the interneuron in the spinal cord:",
        options: [
            "Receives the stimulus directly from the skin",
            "Sends sensory information back to receptors",
            "Serves as the processing center between sensory and motor neurons",
            "Is not involved at all"
        ],
        correctIndex: 2
    },
    {
        id: 50,
        text: "During the withdrawal reflex of the leg, while flexor muscles contract to withdraw the foot, the extensor muscles are inhibited. This is an example of:",
        options: [
            "Convergence",
            "Divergence",
            "Reciprocal inhibition",
            "Summation"
        ],
        correctIndex: 2
    }
];
function Home() {
    _s();
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(Array(questions.length).fill(null));
    const [submitted, setSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSelect = (qIndex, optionIndex)=>{
        if (submitted) return;
        const newAnswers = [
            ...answers
        ];
        newAnswers[qIndex] = optionIndex;
        setAnswers(newAnswers);
    };
    const score = answers.reduce((acc, ans, i)=>{
        if (ans === questions[i].correctIndex) return acc + 1;
        return acc;
    }, 0);
    const handleSubmit = ()=>{
        setSubmitted(true);
    };
    const handleReset = ()=>{
        setAnswers(Array(questions.length).fill(null));
        setSubmitted(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            maxWidth: 900,
            margin: "0 auto",
            padding: "1.5rem"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: "Spinal Cord & Reflex Quiz"
            }, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 372,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Select the best answer for each question and click",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Submit"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 375,
                        columnNumber: 9
                    }, this),
                    " to check your score."
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 373,
                columnNumber: 7
            }, this),
            questions.map((q, qIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        padding: "1rem",
                        marginBottom: "1rem"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontWeight: 600,
                                marginBottom: "0.5rem"
                            },
                            children: [
                                qIndex + 1,
                                ". ",
                                q.text
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/index.tsx",
                            lineNumber: 388,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: q.options.map((opt, optIndex)=>{
                                const isSelected = answers[qIndex] === optIndex;
                                const isCorrect = q.correctIndex === optIndex;
                                const showColor = submitted && isSelected;
                                const bgColor = showColor ? isCorrect ? "#c8f7c5" : "#ffc9c9" : "#f7f7f7";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleSelect(qIndex, optIndex),
                                    style: {
                                        display: "block",
                                        width: "100%",
                                        textAlign: "left",
                                        padding: "0.5rem 0.75rem",
                                        marginBottom: "0.3rem",
                                        borderRadius: 4,
                                        border: "1px solid #ccc",
                                        backgroundColor: bgColor,
                                        cursor: submitted ? "default" : "pointer"
                                    },
                                    children: [
                                        String.fromCharCode(65 + optIndex),
                                        ". ",
                                        opt
                                    ]
                                }, optIndex, true, {
                                    fileName: "[project]/pages/index.tsx",
                                    lineNumber: 402,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/pages/index.tsx",
                            lineNumber: 391,
                            columnNumber: 11
                        }, this),
                        submitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: "0.3rem",
                                fontSize: "0.9rem"
                            },
                            children: [
                                "Correct answer:",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: [
                                        String.fromCharCode(65 + q.correctIndex),
                                        ".",
                                        " ",
                                        q.options[q.correctIndex]
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/index.tsx",
                                    lineNumber: 425,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/index.tsx",
                            lineNumber: 423,
                            columnNumber: 13
                        }, this)
                    ]
                }, q.id, true, {
                    fileName: "[project]/pages/index.tsx",
                    lineNumber: 379,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: "1rem"
                },
                children: [
                    !submitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSubmit,
                        style: {
                            padding: "0.6rem 1.2rem",
                            marginRight: "0.5rem",
                            borderRadius: 4,
                            border: "none",
                            backgroundColor: "#0070f3",
                            color: "white",
                            cursor: "pointer"
                        },
                        children: "Submit"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 436,
                        columnNumber: 11
                    }, this),
                    submitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleReset,
                        style: {
                            padding: "0.6rem 1.2rem",
                            marginRight: "0.5rem",
                            borderRadius: 4,
                            border: "none",
                            backgroundColor: "#555",
                            color: "white",
                            cursor: "pointer"
                        },
                        children: "Try Again"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 452,
                        columnNumber: 11
                    }, this),
                    submitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontWeight: 600,
                            marginLeft: "0.5rem"
                        },
                        children: [
                            "Score: ",
                            score,
                            " / ",
                            questions.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 469,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 434,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.tsx",
        lineNumber: 371,
        columnNumber: 5
    }, this);
}
_s(Home, "Sgcgxdn6P2d/JVO/7NcCh202lj8=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/index.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f5f3eefe._.js.map