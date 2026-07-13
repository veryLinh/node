"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const {
    isLidUser,
    isPnUser,
    isHostedPnUser,
    isHostedLidUser,
    jidDecode,
    jidNormalizedUser,
} = require("../WABinary");
const detectIdType = (id) => {
    if (!id || typeof id !== "string") return "other";
    if (isPnUser(id)) return "jid";
    if (isLidUser(id)) return "lid";
    if (isHostedPnUser(id)) return "hosted_jid";
    if (isHostedLidUser(id)) return "hosted_lid";
    if (id.endsWith("@g.us")) return "group";
    if (id.endsWith("@broadcast")) return "broadcast";
    if (id.endsWith("@newsletter")) return "newsletter";
    return "other";
};
const resolveUserId = async (id, signalRepository) => {
    if (!id) throw new Error("convertJid: id is required");
    if (!signalRepository?.lidMapping) {
        throw new Error(
            "convertJid: signalRepository is required — pass sock.signalRepository"
        );
    }
    const type = detectIdType(id);
    switch (type) {
        case "jid":
        case "hosted_jid": {
            const result = await signalRepository.lidMapping.getLIDForPN(id);
            return result ? jidNormalizedUser(result) : null;
        }
        case "lid":
        case "hosted_lid": {
            const result = await signalRepository.lidMapping.getPNForLID(id);
            return result ? jidNormalizedUser(result) : null;
        }
        case "group":
        case "broadcast":
        case "newsletter":
        default:
            return id;
    }
};
const batchConvertUserId = async (ids, signalRepository) => {
    if (!Array.isArray(ids)) throw new Error("batchConvertJid: ids must be an array");

    return Promise.all(
        ids.map(async (id) => {
            const type = detectIdType(id);
            let output = null;
            let error = null;
            try {
                output = await resolveUserId(id, signalRepository);
            } catch (err) {
                error = err?.message ?? String(err);
            }
            return { input: id, output, type, error };
        })
    );
};

module.exports = {
    detectIdType,
    resolveUserId,
    batchConvertUserId
};
