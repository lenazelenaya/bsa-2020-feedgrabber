import { createRoutine } from 'redux-saga-routines';

export const loadInvitationsListRoutine = createRoutine('INVITATION:LOAD');
export const sendInvitationRoutine = createRoutine('INVITATION:SEND');
export const deleteInvitationRoutine = createRoutine('INVITATION:DELETE');
export const resendInvitationRoutine = createRoutine('INVITATION:RESEND');
