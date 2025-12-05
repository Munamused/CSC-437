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
  switch (message[0]) {
    case "profile/request": {
      const { userid } = message[1];
      if (model.profile?.userid === userid) break;
      return [
        { ...model, profile: { userid } as User },
        requestProfile({ userid }, user)
          .then((profile) => ["profile/load", { userid, profile }])
      ];
    }
    case "profile/load": {
      const { profile } = message[1];
      return { ...model, profile };
    }
    case "memories/request": {
      const { userid } = message[1];
      return [
        model,
        requestMemories({ userid }, user)
          .then((memories) => ["memories/load", { memories }])
      ];
    }
    case "memories/load": {
      const { memories } = message[1];
      return { ...model, memories: {
          memories,
          memoryid: "",
          userid: ""
      } };
    }
    case "profile/save": {
      // Implement the save logic or just return the model for now
      return model;
    }
    default: {
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
    }
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