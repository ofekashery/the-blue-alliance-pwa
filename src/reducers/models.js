import { fromJS, Map } from "immutable";
import * as types from "../constants/ActionTypes";
import { updateSingle, updateMulti } from "../lib/reduxImmutableMergeHelpers";
import Event from "../database/Event";
import Match from "../database/Match";

const models = (state = Map(), action) => {
  switch (action.type) {
    case types.FETCH_YEAR_EVENTS_REQUEST:
      return state.setIn(
        ["eventsStatus", "collections", "byYear", `${action.year}`],
        "fetching"
      );
    case types.FETCH_YEAR_EVENTS_SUCCESS:
      state = updateMulti(
        state,
        "events",
        ["byYear", `${action.year}`],
        fromJS(action.data).map(o => new Event(o))
      );
      return state.setIn(
        ["eventsStatus", "collections", "byYear", `${action.year}`],
        "success"
      );
    case types.FETCH_YEAR_EVENTS_ERROR:
      return state.setIn(
        ["eventsStatus", "collections", "byYear", `${action.year}`],
        "error"
      );
    case types.FETCH_EVENT_REQUEST:
      return state.setIn(
        ["eventsStatus", "byKey", `${action.eventKey}`],
        "fetching"
      );
    case types.FETCH_EVENT_SUCCESS:
      state = updateSingle(
        state,
        "events",
        action.eventKey,
        new Event(fromJS(action.data))
      );
      return state.setIn(
        ["eventsStatus", "byKey", `${action.eventKey}`],
        "success"
      );
    case types.FETCH_EVENT_ERROR:
      return state.setIn(
        ["eventsStatus", "byKey", `${action.eventKey}`],
        "error"
      );
    case types.FETCH_EVENT_MATCHES_REQUEST:
      return state.setIn(
        ["matchesStatus", "collections", "byEvent", `${action.eventKey}`],
        "fetching"
      );
    case types.FETCH_EVENT_MATCHES_SUCCESS:
      state = updateMulti(
        state,
        "matches",
        ["byEvent", `${action.eventKey}`],
        fromJS(action.data).map(o => new Match(o))
      );
      return state.setIn(
        ["matchesStatus", "collections", "byEvent", `${action.eventKey}`],
        "success"
      );
    case types.FETCH_EVENT_MATCHES_ERROR:
      return state.setIn(
        ["matchesStatus", "collections", "byEvent", `${action.eventKey}`],
        "error"
      );
    case types.FETCH_MATCH_REQUEST:
      return state.setIn(
        ["matchesStatus", "byKey", `${action.matchKey}`],
        "fetching"
      );
    case types.FETCH_MATCH_SUCCESS:
      state = updateSingle(
        state,
        "matches",
        action.matchKey,
        new Match(fromJS(action.data))
      );
      return state.setIn(
        ["matchesStatus", "byKey", `${action.matchKey}`],
        "success"
      );
    case types.FETCH_MATCH_ERROR:
      return state.setIn(
        ["matchesStatus", "byKey", `${action.matchKey}`],
        "error"
      );
    default:
      return state;
  }
};
export default models;
