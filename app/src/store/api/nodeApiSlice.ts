import { toast } from "react-toastify";

import {
  CreateNodePayload,
  DeleteNodePayload,
  UpdateNodePayload,
} from "@cmumaps/shared/websocket-types/nodeTypes";
import {
  buildCreateNodeEditPair,
  buildDeleteNodeEditPair,
  buildUpdateNodeEditPair,
} from "../features/history/historyGraphUtils";
import { addEditToHistory } from "../features/history/historySlice";
import { getSocketId } from "../middleware/webSocketMiddleware";
import { AppDispatch, RootState } from "../store";
import { apiSlice, BaseMutationArg } from "./apiSlice";
import { handleQueryError } from "./errorHandler";
import { floorDataApiSlice } from "./floorDataApiSlice";

export type CreateNodeArg = BaseMutationArg & CreateNodePayload;
export type DeleteNodeArg = BaseMutationArg & DeleteNodePayload;
export type UpdateNodeArg = BaseMutationArg & UpdateNodePayload;

export const createNode =
  (floorCode: string, { nodeId, nodeInfo }: CreateNodePayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorGraph",
        floorCode,
        (draft) => {
          draft[nodeId] = nodeInfo;
        },
      ),
    );

export const deleteNode =
  (floorCode: string, { nodeId }: DeleteNodePayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorGraph",
        floorCode,
        (draft) => {
          delete draft[nodeId];
        },
      ),
    );

export const updateNode =
  (floorCode: string, { nodeId, nodeInfo }: UpdateNodePayload) =>
  (dispatch: AppDispatch) =>
    dispatch(
      floorDataApiSlice.util.updateQueryData(
        "getFloorGraph",
        floorCode,
        (draft) => {
          draft[nodeId] = nodeInfo;
        },
      ),
    );

export const nodeApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createNode: builder.mutation<Response, CreateNodeArg>({
      query: ({ floorCode, nodeId, nodeInfo }) => ({
        url: `nodes/${nodeId}`,
        method: "POST",
        body: { floorCode, nodeInfo },
        headers: { "X-Socket-ID": getSocketId() },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { floorCode, nodeId, batchId, nodeInfo } = arg;
          // add to history
          if (batchId) {
            const editPair = buildCreateNodeEditPair(batchId, arg);
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(
            createNode(floorCode, { nodeId, nodeInfo }),
          );
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    deleteNode: builder.mutation<Response, DeleteNodeArg>({
      query: ({ nodeId }) => ({
        url: `nodes/${nodeId}`,
        method: "DELETE",
        headers: { "X-Socket-ID": getSocketId() },
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        try {
          const { floorCode, nodeId, batchId } = arg;
          // add to history
          if (batchId) {
            const getStore = getState as () => RootState;
            const editPair = await buildDeleteNodeEditPair(
              batchId,
              arg,
              getStore,
              dispatch,
            );
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(deleteNode(floorCode, { nodeId }));
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
    updateNode: builder.mutation<Response, UpdateNodeArg>({
      query: ({ floorCode, nodeId, nodeInfo }) => ({
        url: `nodes/${nodeId}`,
        method: "PUT",
        body: { floorCode, nodeInfo },
        headers: { "X-Socket-ID": getSocketId() },
      }),
      async onQueryStarted(arg, { getState, dispatch, queryFulfilled }) {
        try {
          const { floorCode, nodeId, nodeInfo, batchId } = arg;
          // add to history
          if (batchId) {
            const getStore = getState as () => RootState;
            const editPair = await buildUpdateNodeEditPair(
              batchId,
              arg,
              getStore,
              dispatch,
            );
            dispatch(addEditToHistory(editPair));
          }
          // optimistic update
          const { undo } = dispatch(
            updateNode(floorCode, { nodeId, nodeInfo }),
          );
          handleQueryError(queryFulfilled, undo);
        } catch (e) {
          toast.error("Check the Console for detailed error.");
          console.error(e);
        }
      },
    }),
  }),
});

export const {
  useCreateNodeMutation,
  useDeleteNodeMutation,
  useUpdateNodeMutation,
} = nodeApiSlice;
