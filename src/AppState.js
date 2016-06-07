import Kefir from 'kefirjs'

import AppDispatcher from './AppDispatcher'
import createStore from './createStore'
import createSideEffects from './createSideEffects'


const AppState = {}

const _storeInfo = []
const _sideEffectsInfo = []

/**
 * See #createStore for docs.
 *
 * This creates the store, adds it to the store info collection,
 * then recreates the combined AppState observable (optional)
 *
 * @param storeName
 * @param channel
 * @param Actions
 * @param Reducers
 * @param ActionFunctions
 * @param ActionObservables
 */
export function registerStore(channel, {Actions, Reducers, ActionFunctions, ActionObservables}) {

  const store = createStore(channel, {Actions, Reducers, ActionFunctions, ActionObservables})(AppDispatcher)

  // add store to store info collection
  _storeInfo.push(store)

  // update app state observable with latest
  const storeObservables = _storeInfo.map(x => x.observable)
  const appStateObservable = Kefir.combine(storeObservables, (...observables) =>
    observables.reduce(
      (stores, store, i) => Object.assign(stores, {[`${_storeInfo[i].name}`]: store.state}), {}
    )
  )

  Object.assign(AppState, {appStateObservable})

  // add store to AppState
  Object.assign(AppState, {...store.store})

  // setup one-way data flow + side effects
  store.observable.onValue(state =>
    state.sideEffects.forEach(sideEffect => setTimeout(() => AppDispatcher.emit(sideEffect), 0))
  )
}

export function registerSideEffects(channel, {SideEffects, SideEffectActionFunctions, SideEffectHandlers}) {

  const sideEffectsFunction = createSideEffects(channel, {SideEffects, SideEffectActionFunctions, SideEffectHandlers})
  const sideEffects = sideEffectsFunction(AppDispatcher, AppState)

  // store side effects
  _sideEffectsInfo.push(sideEffects)

  // add side effect action functions to app state
  Object.assign(AppState, sideEffects.sideEffects)

  // setup one-way data flow
  sideEffects.observable.onValue(() => undefined)
}

export default AppState


