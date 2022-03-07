import {
  checkDestination,
} from './utils';

describe('Testing task movement constraints', () => {
  it('should not move from done to anywhere', () => {
    expect(checkDestination({
      index: 0,
      droppableId: '2',
    },
      {
        index: 0,
        droppableId: '0'
      }
    )).toBe(false);
    expect(checkDestination({
      index: 0,
      droppableId: '2',
    },
      {
        index: 0,
        droppableId: '1'
      }
    )).toBe(false);
  });
  // TODO
  it('should not move from todo to done direct', () => {
    expect(checkDestination({
      index: 0,
      droppableId: '0',
    },
      {
        index: 0,
        droppableId: '2'
      }
    )).toBe(false);
  });
  it('should be able to move from todo to progress', () => {
    expect(checkDestination({
      index: 0,
      droppableId: '0',
    },
      {
        index: 0,
        droppableId: '1'
      }
    )).toBe(true);
  });
  // PROGRESS
  it('should be able to move from progress to anywhere', () => {
    expect(checkDestination({
      index: 0,
      droppableId: '1',
    },
      {
        index: 0,
        droppableId: '0'
      }
    )).toBe(true);
    expect(checkDestination({
      index: 0,
      droppableId: '1',
    },
      {
        index: 0,
        droppableId: '2'
      }
    )).toBe(true);
  });
});
