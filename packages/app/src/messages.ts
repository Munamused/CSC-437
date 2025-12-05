import { User } from "../../server/src/models/user";
import { MemoryItem } from "../../server/src/models/memory";

export type Msg =
  | [
      "profile/save",
      {
        userid: string;
        profile: User;
      },
      {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "memory/save",
      {
        memoryid: string;
        memory: MemoryItem;
      },
      {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | ["profile/request", { userid: string }]
  | ["memories/request", { userid: string }]
  | Cmd;

type Cmd =
  | ["profile/load", { userid: string; profile: User }]
  | ["memories/load", { memories: MemoryItem[] }]
  | ["memory/saved", { memory: MemoryItem }];