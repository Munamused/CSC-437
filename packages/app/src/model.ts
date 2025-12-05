// app/src/model.ts
import { Memories} from "../../server/src/models/memories";
import { User } from "../../server/src/models/user";

export interface Model {
  memories?: Memories;
  profile?: User;
}

export const init: Model = {};