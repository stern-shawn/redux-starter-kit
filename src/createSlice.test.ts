import { createSlice } from './createSlice'
import { createAction, PayloadAction } from './createAction'

describe('createSlice', () => {
  describe('when slice is empty', () => {
    const { actions, reducer } = createSlice({
      reducers: {
        increment: state => state + 1,
        multiply: (state, action: PayloadAction<number>) =>
          state * action.payload
      },
      initialState: 0
    })

    it('should create increment action', () => {
      expect(actions.hasOwnProperty('increment')).toBe(true)
    })

    it('should create multiply action', () => {
      expect(actions.hasOwnProperty('multiply')).toBe(true)
    })

    it('should have the correct action for increment', () => {
      expect(actions.increment()).toEqual({
        type: 'increment',
        payload: undefined
      })
    })

    it('should have the correct action for multiply', () => {
      expect(actions.multiply(3)).toEqual({
        type: 'multiply',
        payload: 3
      })
    })

    describe('when using reducer', () => {
      it('should return the correct value from reducer with increment', () => {
        expect(reducer(undefined, actions.increment())).toEqual(1)
      })

      it('should return the correct value from reducer with multiply', () => {
        expect(reducer(2, actions.multiply(3))).toEqual(6)
      })
    })
  })

  describe('when passing slice', () => {
    const { actions, reducer } = createSlice({
      reducers: {
        increment: state => state + 1
      },
      initialState: 0,
      slice: 'cool'
    })

    it('should create increment action', () => {
      expect(actions.hasOwnProperty('increment')).toBe(true)
    })

    it('should have the correct action for increment', () => {
      expect(actions.increment()).toEqual({
        type: 'cool/increment',
        payload: undefined
      })
    })

    it('should return the correct value from reducer', () => {
      expect(reducer(undefined, actions.increment())).toEqual(1)
    })
  })

  describe('when mutating state object', () => {
    const initialState = { user: '' }

    const { actions, reducer } = createSlice({
      reducers: {
        setUserName: (state, action) => {
          state.user = action.payload
        }
      },
      initialState,
      slice: 'user'
    })

    it('should set the username', () => {
      expect(reducer(initialState, actions.setUserName('eric'))).toEqual({
        user: 'eric'
      })
    })
  })

  describe('when passing extra reducers', () => {
    const addMore = createAction('ADD_MORE')

    const { reducer } = createSlice({
      reducers: {
        increment: state => state + 1,
        multiply: (state, action) => state * action.payload
      },
      extraReducers: {
        [addMore.type]: (state, action) => state + action.payload.amount
      },
      initialState: 0
    })

    it('should call extra reducers when their actions are dispatched', () => {
      const result = reducer(10, addMore({ amount: 5 }))

      expect(result).toBe(15)
    })
  })

  describe('behaviour with enhanced case reducers', () => {
    it('should pass all arguments to the prepare function', () => {
      const prepare = jest.fn((payload, somethingElse) => ({ payload }))

      const testSlice = createSlice({
        slice: 'test',
        initialState: 0,
        reducers: {
          testReducer: {
            reducer: s => s,
            prepare
          }
        }
      })

      expect(testSlice.actions.testReducer('a', 1)).toEqual({
        type: 'test/testReducer',
        payload: 'a'
      })
      expect(prepare).toHaveBeenCalledWith('a', 1)
    })

    it('should call the reducer function', () => {
      const reducer = jest.fn()

      const testSlice = createSlice({
        slice: 'test',
        initialState: 0,
        reducers: {
          testReducer: {
            reducer,
            prepare: payload => ({ payload })
          }
        }
      })

      testSlice.reducer(0, testSlice.actions.testReducer('testPayload'))
      expect(reducer).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ payload: 'testPayload' })
      )
    })
  })
})
