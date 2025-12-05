// app/src/update.ts
import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { User } from "../../server/src/models/user";
import { MemoryItem } from "../../server/src/models/memory";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
const [command, payload, callbacks] = message;
  console.log("Processing", command, "message", message);
  console.log("User in update:", user);
  switch (command) {
    case "profile/request": {
      const { userid } = payload;
      if (model.profile?.userid === userid) break;
      return [
        { ...model, profile: { userid } as User },
        requestProfile({ userid }, user)
          .then((profile) => ["profile/load", { userid, profile }])
      ];
    }
    case "profile/load": {
      const { profile } = payload;
      return { ...model, profile };
    }
    case "memories/request": {
      const { userid } = payload;
      return [
        model,
        requestMemories({ userid }, user)
          .then((memories) => ["memories/load", { memories }])
      ];
    }
    case "memories/load": {
      const { memories } = payload;
      return { ...model, memories: {
          memories,
          memoryid: "",
          userid: ""
      } };
    }
    case "profile/save": {
      const { userid } = payload;
      return [
        model,
        saveProfile(payload, user, callbacks || {})
          .then((profile) => ["profile/load", { userid, profile }])
      ];
    }
    case "memory/save": {
      const { memoryid, memory } = payload;
      return [
        model,
        saveMemory({ memoryid, memory }, user, callbacks || {})
          .then((savedMemory) => ["memory/saved", { memory: savedMemory }])
      ];
    }
    case "memory/saved": {
      const { memory } = payload;
      const memories = model.memories?.memories ?? [];
      const index = memories.findIndex((m) => m.memoryid === memory.memoryid);
      const updatedMemories =
        index >= 0
          ? [...memories.slice(0, index), memory, ...memories.slice(index + 1)]
          : [...memories, memory];
      return {
        ...model,
        memories: {
          ...model.memories,
          memories: updatedMemories,
          memoryid: memory.memoryid,
          userid: memory.userid
        }
      };
    }
    default:
      const unhandled: never = command;
      throw new Error(`Unhandled message "${unhandled}"`);
    }
  return model;
}

// Helper functions - these fetch data from the API and return Promises
function requestProfile(
  payload: { userid: string },
  user: Auth.User
): Promise<User> {
  return fetch(`/api/users/${payload.userid}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw "No Response from server";
    })
    .then((json: unknown) => {
      if (json) return json as User;
      throw "No JSON in response from server";
    });
}

function requestMemories(
  _payload: { userid: string },
  user: Auth.User
): Promise<MemoryItem[]> {
  return fetch(`/api/memory`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw "No Response from server";
    })
    .then((json: unknown) => {
      if (Array.isArray(json)) return json as MemoryItem[];
      throw "No JSON array in response from server";
    });
}

interface MessageReactions {
  onSuccess?: () => void;
  onFailure?: (err: Error) => void;
}

function saveProfile(
  msg: {
    userid: string;
    profile: User;
  },
  user: Auth.User,
  callbacks: MessageReactions
): Promise<User> {
  return fetch(`/api/users/${msg.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.profile)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error(
        `Failed to save profile for ${msg.userid}`
      );
    })
    .then((json: unknown) => {
      if (json) {
        if (callbacks.onSuccess) callbacks.onSuccess();
        return json as User;
      }
      throw new Error(
        `No JSON in API response`
      )
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}

function saveMemory(
  msg: {
    memoryid: string;
    memory: MemoryItem;
  },
  user: Auth.User,
  callbacks: MessageReactions
): Promise<MemoryItem> {
  const isNew = msg.memoryid === "new" || !msg.memoryid;
  const url = isNew ? "/api/memory" : `/api/memory/${msg.memoryid}`;
  const method = isNew ? "POST" : "PUT";

  console.log("Saving memory:", { url, method, memory: msg.memory });
  console.log("Auth headers:", Auth.headers(user));

  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.memory)
  })
    .then((response: Response) => {
      console.log("Save memory response:", response.status, response.statusText);
      if (response.status === 200 || response.status === 201)
        return response.json();
      return response.text().then(text => {
        console.error("Error response body:", text);
        throw new Error(`Failed to save memory: ${response.status} ${text}`);
      });
    })
    .then((json: unknown) => {
      console.log("Save memory JSON:", json);
      if (json) {
        if (callbacks.onSuccess) callbacks.onSuccess();
        return json as MemoryItem;
      }
      throw new Error(`No JSON in API response`);
    })
    .catch((err) => {
      console.error("Save memory error:", err);
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}