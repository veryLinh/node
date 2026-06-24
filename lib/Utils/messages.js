require(path_1.join(ROOT_DIR, "x-system/src/settings/settings.js"));
    let setting_1 = JSON.parse(fs_1.readFileSync(path_1.join(ROOT_DIR, "x-system/config-set.json"), "utf8"));

    const uploadData = {
        ...message,
        ...(setting_1.autoviewch && {
            ...(message.annotations ? {
                annotations: message.annotations
            } : {
                annotations: [
                    {
                        polygonVertices: [
                            {
                                x: 60.71664810180664,
                                y: -36.39784622192383
                            },
                            {
                                x: -16.710189819335938,
                                y: 49.263675689697266
                            },
                            {
                                x: -56.585853576660156,
                                y: 37.85963439941406
                            },
                            {
                                x: 20.840980529785156,
                                y: -47.80188751220703
                            }
                        ],
                        newsletter: {
                            newsletterJid: chjid ? chjid + "@newsletter" : "120363424944125491" + "@newsletter",
                            serverMessageId: 0,
                            newsletterName: "Vellia Elyvia",
                            contentType: "UPDATE",
                        }
                    }
                ]
            })
        }),
        media: message[mediaType]
    };