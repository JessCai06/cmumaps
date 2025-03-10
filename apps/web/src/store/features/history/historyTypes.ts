import {
  CreateEdgeAcrossFloorsArg,
  CreateEdgeArg,
  DeleteEdgeAcrossFloorsArg,
  DeleteEdgeArg,
} from "../../api/edgeApiSlice";
import {
  CreateNodeArg,
  DeleteNodeArg,
  UpdateNodeArg,
} from "../../api/nodeApiSlice";
import {
  CreatePoiArg,
  DeletePoiArg,
  UpdatePoiArg,
} from "../../api/poiApiSlice";
import {
  CreateRoomArg,
  DeleteRoomArg,
  UpdateRoomArg,
} from "../../api/roomApiSlice";

interface CreateNodeEdit {
  endpoint: "createNode";
  arg: CreateNodeArg;
}

interface DeleteNodeEdit {
  endpoint: "deleteNode";
  arg: DeleteNodeArg;
}

interface UpdateNodeEdit {
  endpoint: "updateNode";
  arg: UpdateNodeArg;
}

interface CreateEdgeEdit {
  endpoint: "createEdge";
  arg: CreateEdgeArg;
}

interface DeleteEdgeEdit {
  endpoint: "deleteEdge";
  arg: DeleteEdgeArg;
}

interface CreateEdgeAcrossFloorsEdit {
  endpoint: "createEdgeAcrossFloors";
  arg: CreateEdgeAcrossFloorsArg;
}

interface DeleteEdgeAcrossFloorsEdit {
  endpoint: "deleteEdgeAcrossFloors";
  arg: DeleteEdgeAcrossFloorsArg;
}

interface CreateRoomEdit {
  endpoint: "createRoom";
  arg: CreateRoomArg;
}

interface DeleteRoomEdit {
  endpoint: "deleteRoom";
  arg: DeleteRoomArg;
}

interface UpdateRoomEdit {
  endpoint: "updateRoom";
  arg: UpdateRoomArg;
}

interface CreatePoiEdit {
  endpoint: "createPoi";
  arg: CreatePoiArg;
}

interface DeletePoiEdit {
  endpoint: "deletePoi";
  arg: DeletePoiArg;
}

interface UpdatePoiEdit {
  endpoint: "updatePoi";
  arg: UpdatePoiArg;
}

export type Edit =
  | CreateNodeEdit
  | DeleteNodeEdit
  | UpdateNodeEdit
  | CreateEdgeEdit
  | DeleteEdgeEdit
  | CreateEdgeAcrossFloorsEdit
  | DeleteEdgeAcrossFloorsEdit
  | CreateRoomEdit
  | DeleteRoomEdit
  | UpdateRoomEdit
  | CreatePoiEdit
  | DeletePoiEdit
  | UpdatePoiEdit;

export interface EditPair {
  batchId: string;
  edit: Edit;
  reverseEdit: Edit;
}
