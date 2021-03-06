// Node Libs
import uuidv4 from 'uuid/v4';

// Actions Verbs
import * as ACTION_TYPES from '../constants/actions.jsx';

// Helpers
import { getAllDocs, saveDoc, deleteDoc } from '../helpers/pouchDB';

const ContactsMW = ({dispatch}) => next => action => {
  switch (action.type) {
    case ACTION_TYPES.CONTACT_GET_ALL: {
      return getAllDocs('contacts')
        .then(allDocs => {
          next(
            Object.assign({}, action, {
              payload: allDocs,
            }),
          );
        })
        .catch(err => {
          next({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'warning',
              message: err.message,
            },
          });
        });
    }

    case ACTION_TYPES.CONTACT_SAVE: {
      const doc = Object.assign({}, action.payload, {
        _id: uuidv4(),
        created_at: Date.now(),
      });
      return saveDoc('contacts', doc)
        .then(newDocs => {
          next({
            type: ACTION_TYPES.CONTACT_SAVE,
            payload: newDocs
          });
          dispatch({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'success',
              message: 'Contact Created Successfully'
            }
          });
        })
        .catch(err => {
          next({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'warning',
              message: err.message,
            },
          });
        });
    }

    case ACTION_TYPES.CONTACT_DELETE: {
      return deleteDoc('contacts', action.payload)
        .then(remainingDocs => {
          next({
            type: ACTION_TYPES.CONTACT_DELETE,
            payload: remainingDocs,
          });
          dispatch({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'success',
              message: 'Deleted Successfully',
            },
          });
        })
        .catch(err => {
          next({
            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            payload: {
              type: 'warning',
              message: err.message,
            },
          });
        });
    }

    default: {
      return next(action);
    }
  }
};

export default ContactsMW;
