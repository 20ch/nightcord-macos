import { addContextMenuPatch, NavContextMenuPatchCallback, removeContextMenuPatch } from "@api/ContextMenu";

import definePlugin from "@utils/types";
import { ChannelStore, FluxDispatcher, Menu, React, UserStore, Toasts } from "@webpack/common";
import { findByPropsLazy } from "@webpack";
import { Modals, openModal } from "@utils/modal";

let __fakeId = 0n;
function makeSnowflake() {
    __fakeId++;
    return ((BigInt(Date.now() - 1420070400000) << 22n) | __fakeId).toString();
}

function makeUserPayload(user: any) {
    if (!user) return {};
    return {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        public_flags: user.publicFlags,
        banner: user.banner,
        banner_color: user.bannerColor,
        accent_color: user.accentColor,
        global_name: user.globalName,
        avatar_decoration_data: user.avatarDecorationData,
    };
}

const ChannelClassProxy = findByPropsLazy("ChannelRecordBase") as any;
function getChannelClass() {
    return ChannelClassProxy?.ChannelRecordBase || null;
}

const MessageRequestActions = findByPropsLazy("getRequests", "hasRequest") as any;
let MessageRequestStore: any = null;
let origGetRequests: Function | null = null;
let origHasRequest: Function | null = null;
const fakeMessageRequests = new Map<string, { user: any; channelId: string; msgId: string; timestamp: string; }>();

function patchMessageRequestStore() {
    if (MessageRequestStore) return;
    try {
        const store = MessageRequestActions;
        if (!store) return;
        MessageRequestStore = store;

        if (typeof store.getRequests === "function" && !origGetRequests) {
            origGetRequests = store.getRequests;
            store.getRequests = function () {
                const real = origGetRequests!.call(this) ?? {};
                for (const [channelId, data] of fakeMessageRequests) {
                    real[channelId] = { channelId, requesterId: data.user.id };
                }
                return real;
            };
        }

        if (typeof store.hasRequest === "function" && !origHasRequest) {
            origHasRequest = store.hasRequest;
            store.hasRequest = function (channelId: string) {
                if (fakeMessageRequests.has(channelId)) return true;
                return origHasRequest!.call(this, channelId);
            };
        }
    } catch (e) {
        console.warn("[FakeMessageRequest] patchMessageRequestStore:", e);
    }
}

function unpatchMessageRequestStore() {
    if (!MessageRequestStore) return;
    if (origGetRequests) {
        MessageRequestStore.getRequests = origGetRequests;
        origGetRequests = null;
    }
    if (origHasRequest) {
        MessageRequestStore.hasRequest = origHasRequest;
        origHasRequest = null;
    }
    MessageRequestStore = null;
    fakeMessageRequests.clear();
}

const fakeDMChannelObjects = new Map<string, any>();
let origGetChannel: Function | null = null;
let origGetDMFromUserId: Function | null = null;
let origGetSorted: Function | null = null;

function patchChannelStore() {
    const store = ChannelStore as any;
    if (!origGetChannel && typeof store.getChannel === "function") {
        origGetChannel = store.getChannel;
        store.getChannel = function (id: string) {
            if (fakeDMChannelObjects.has(id)) return fakeDMChannelObjects.get(id);
            return origGetChannel!.call(this, id);
        };
    }
    if (!origGetDMFromUserId && typeof store.getDMFromUserId === "function") {
        origGetDMFromUserId = store.getDMFromUserId;
        store.getDMFromUserId = function (userId: string) {
            for (const [cid, ch] of fakeDMChannelObjects) {
                if ((ch.recipientIDs ?? []).includes(userId)) return cid;
            }
            return origGetDMFromUserId!.call(this, userId);
        };
    }
    if (!origGetSorted && typeof store.getSortedPrivateChannels === "function") {
        origGetSorted = store.getSortedPrivateChannels;
        store.getSortedPrivateChannels = function () {
            const real = origGetSorted!.call(this) ?? [];
            return [...real, ...fakeDMChannelObjects.values()];
        };
    }
}

function unpatchChannelStore() {
    const store = ChannelStore as any;
    if (origGetChannel) { store.getChannel = origGetChannel; origGetChannel = null; }
    if (origGetDMFromUserId) { store.getDMFromUserId = origGetDMFromUserId; origGetDMFromUserId = null; }
    if (origGetSorted) { store.getSortedPrivateChannels = origGetSorted; origGetSorted = null; }
    fakeDMChannelObjects.clear();
}

async function sendIncomingMessageRequest(user: any, content: string) {
    const ChannelClass = getChannelClass();
    const msgId = makeSnowflake();
    const channelId = makeSnowflake();
    const now = new Date().toISOString();

    const raw = {
        id: channelId,
        type: 1,
        flags: 0,
        last_message_id: msgId,
        last_pin_timestamp: null,
        recipients: [makeUserPayload(user)],
        recipient_ids: [user.id],
        is_spam: false,
        is_message_request: true,
        is_message_request_timestamp: now,
    };

    let instance: any = null;
    if (ChannelClass) {
        try { instance = new ChannelClass(raw); } catch { }
    }
    if (!instance) {
        instance = Object.assign(Object.create({
            getGuildId() { return null; },
            isPrivate() { return true; },
            isDM() { return true; },
            isGroupDM() { return false; },
            isMultiUserDM() { return false; },
            isSystemDM() { return false; },
            isGuildVoice() { return false; },
            isGuildStageVoice() { return false; },
            isGuildPublicThread() { return false; },
            isGuildPrivateThread() { return false; },
            isGuildNewsThread() { return false; },
            isThread() { return false; },
            isArchivedLockedThread() { return false; },
            isManaged() { return false; },
            isCategory() { return false; },
            isDirectory() { return false; },
            isAnnouncement() { return false; },
            isListenModeCapable() { return false; },
            isForumChannel() { return false; },
            isMediaPostChannel() { return false; },
            isBroadcastChannel() { return false; },
            hasActiveThreads() { return false; },
            canHaveInvite() { return false; },
            canHaveWebhooks() { return false; },
            isEmojiPickerDisabled() { return false; },
            computeLurkerPermissionsAllowList() { return null; },
            toString() { return `<#${(this as any).id}>`; },
        }), {
            id: channelId, type: 1, flags: 0,
            guild_id: null, guildId: null,
            lastMessageId: msgId, lastPinTimestamp: null,
            name: "", icon: null, ownerId: null, applicationId: null,
            recipients: [user.id], recipientIDs: [user.id],
            rawRecipients: [makeUserPayload(user)],
            nicks: {},
            isSpam: false,
            isMessageRequest: true,
            isMessageRequestTimestamp: now,
            blockedUserWarningDismissed: false, safetyWarnings: null,
            permissionOverwrites: {}, bitrate: 0, userLimit: 0,
            rateLimitPerUser: 0, rtcRegion: null, videoQualityMode: 1,
            defaultThreadRateLimitPerUser: 0, nsfw: false, topic: null,
            position: 0, parentId: null, defaultAutoArchiveDuration: null,
            member: null, memberCount: null, messageCount: null,
            totalMessageSent: null, threadMetadata: null,
            defaultReactionEmoji: null, availableTags: null,
            appliedTags: null, flags_: 0,
        });
    }

    fakeDMChannelObjects.set(channelId, instance);
    fakeMessageRequests.set(channelId, { user, channelId, msgId, timestamp: now });

    FluxDispatcher.dispatch({ type: "CHANNEL_CREATE", channel: instance });
    await new Promise(r => setTimeout(r, 50));

    FluxDispatcher.dispatch({
        type: "MESSAGE_CREATE",
        channelId,
        message: {
            id: msgId,
            type: 0,
            content: content,
            channel_id: channelId,
            author: makeUserPayload(user),
            attachments: [], embeds: [], mentions: [],
            mention_roles: [], mention_channels: [],
            pinned: false, mention_everyone: false, tts: false,
            timestamp: now,
            edited_timestamp: null, flags: 0, components: [],
            nonce: msgId,
        },
        optimistic: false,
        isPushNotification: false,
    });
}

function askMessage(title: string): Promise<string | null> {
    return new Promise(resolve => {
        const resolveRef = { current: resolve, done: false };

        function MsgModal({ modalProps }: { modalProps: any; }) {
            const [value, setValue] = React.useState("");

            function confirm() {
                if (!value.trim() || resolveRef.done) return;
                resolveRef.done = true;
                modalProps.onClose();
                resolveRef.current(value);
            }

            function cancel() {
                if (!resolveRef.done) {
                    resolveRef.done = true;
                    resolveRef.current(null);
                }
                modalProps.onClose();
            }

            return (
                <Modals.ModalRoot {...modalProps} size="small">
                    <Modals.ModalHeader>
                        <Modals.ModalCloseButton onClick={cancel} />
                        <h2 style={{ flex: 1, fontSize: 16, fontWeight: 700, color: "var(--white-500)" }}>
                            {title}
                        </h2>
                    </Modals.ModalHeader>
                    <Modals.ModalContent style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: ".04em" }}>
                                Message Content
                            </label>
                            <input
                                autoFocus
                                type="text"
                                value={value}
                                onChange={e => setValue(e.currentTarget.value)}
                                onKeyDown={e => { if (e.key === "Enter") confirm(); }}
                                style={{
                                    background: "var(--background-secondary)",
                                    border: "1px solid var(--background-modifier-accent)",
                                    borderRadius: 4,
                                    color: "#fff",
                                    fontSize: 16,
                                    padding: "8px 12px",
                                    width: "100%",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>
                    </Modals.ModalContent>
                    <Modals.ModalFooter>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, width: "100%" }}>
                            <button
                                onClick={cancel}
                                style={{
                                    background: "transparent", border: "none", color: "#fff",
                                    cursor: "pointer", padding: "8px 16px", fontSize: 14, fontWeight: 500
                                }}
                            >Cancel</button>
                            <button
                                onClick={confirm}
                                disabled={!value.trim()}
                                style={{
                                    background: "var(--brand-experiment)", border: "none", color: "#fff",
                                    borderRadius: 4, cursor: value.trim() ? "pointer" : "not-allowed",
                                    padding: "8px 16px", fontSize: 14, fontWeight: 500,
                                    opacity: value.trim() ? 1 : 0.5
                                }}
                            >Confirm</button>
                        </div>
                    </Modals.ModalFooter>
                </Modals.ModalRoot>
            );
        }

        openModal(modalProps => <MsgModal modalProps={modalProps} />);
    });
}

const userContextPatch: NavContextMenuPatchCallback = (children, props) => {
    if (!children || !Array.isArray(children)) return;
    try {
        const userId = props?.user?.id ?? props?.userId;
        if (!userId || userId === UserStore.getCurrentUser()?.id) return;
        const user = props?.user ?? UserStore.getUser(userId);
        if (!user) return;

        const followIndex = children.findIndex((c: any) =>
            c?.props?.id === "follow-user" || c?.key === "follow-user"
        );

        const item = (
            <Menu.MenuItem
                key="ff-fake-msg-req"
                id="ff-fake-msg-req"
                label="Fake Message Request"
                action={async () => {
                    const content = await askMessage("Message Request Content");
                    if (content) {
                        await sendIncomingMessageRequest(user, content);
                        Toasts.show({ message: "Fake message request received!", type: Toasts.Type.SUCCESS, id: Toasts.genId() });
                    }
                }}
            />
        );

        if (followIndex !== -1) {
            children.splice(followIndex + 1, 0, item);
        } else {
            children.push(item);
        }
    } catch (e) {
        console.error("[FakeMessageRequest] context menu patch error:", e);
    }
};

export default definePlugin({
    name: "FakeMessageRequest",
    description: "Adds a context menu option to create a fake message request from a user.",
    authors: [{ name: "Nightcord", id: 0n }],
    enabledByDefault: true,
    start() {
        patchChannelStore();
        patchMessageRequestStore();
        addContextMenuPatch("user-context", userContextPatch);
    },
    stop() {
        removeContextMenuPatch("user-context", userContextPatch);
        unpatchChannelStore();
        unpatchMessageRequestStore();
    }
});
