import { User } from "../../server/src/models/user";
import { MemoryItem } from "../../server/src/models/memory";

export type Msg =
  | ["profile/save", { userid: string; profile: User }]
  | ["profile/request", { userid: string }]
  | ["memories/request", { userid: string }]
  | Cmd
  ;

type Cmd =
  | ["profile/load", { userid: string, profile: User }]
  | ["memories/load", { memories: MemoryItem[] }];