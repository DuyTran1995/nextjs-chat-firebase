import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {
  Avatar,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  IconButton, TextField,
  Tooltip
} from "@mui/material";
import * as EmailValidator from 'email-validator';
import {Chat, Logout, MoreVertSharp, Search} from "@mui/icons-material";
import {signOut} from "@firebase/auth";
import {auth, db} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {addDoc, collection, query, where} from 'firebase/firestore'
import {useCollection} from "react-firebase-hooks/firestore";
import {Conversation} from "../types";
import ConversationSelect from "./ConversationSelect";

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: auto;
  border-right: 1px solid whitesmoke;
  /* Hide scrollbar for Chrome, Safari and Opera */

  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
`

const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 2px;
`

const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`

const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`

const StyledSidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`

interface IProp {

}

const Sidebar: React.FC<IProp> = () => {
  const [loggedInUser, _loading, _error] = useAuthState(auth)

  const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] =
    useState(false)

  const [recipientEmail, setRecipientEmail] = useState('')

  const toggleNewConversationDialog = (isOpen: boolean) => {
    setIsOpenNewConversationDialog(isOpen)
    if (!isOpen) setRecipientEmail('')
  }

  const closeNewConversationDialog = () => {
    toggleNewConversationDialog(false)
  }

  const queryGetConversationsForCurrentUser = query(
    collection(db, 'conversations'),
    where('users', 'array-contains', loggedInUser?.email)
  )

  const [conversationsSnapshot, __loading, __error] = useCollection(
    queryGetConversationsForCurrentUser
  )

  const isConversationAlreadyExists = (recipientEmail: string) =>
    conversationsSnapshot?.docs.find(conversation =>
      (conversation.data() as Conversation).users.includes(recipientEmail)
    )

  const isInvitingSelf = recipientEmail === loggedInUser?.email

  const createConversation = async () => {
    if (!recipientEmail) return

    if (
      EmailValidator.validate(recipientEmail) &&
      !isInvitingSelf &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      // Add conversations user to db "conversations" collection
      // A conversations is between the currently logged in user and the user invited.

      await addDoc(collection(db, 'conversations'), {
        users: [loggedInUser?.email, recipientEmail]
      })
    }

    closeNewConversationDialog()
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.log('ERROR LOGGING OUT', error)
    }
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip placement='right' title={loggedInUser?.email as string}>
          <StyledUserAvatar src={loggedInUser?.photoURL as string}/>
        </Tooltip>

        <div>
          <IconButton>
            <Chat/>
          </IconButton>
          <IconButton>
            <MoreVertSharp/>
          </IconButton>
          <IconButton>
            <Logout onClick={logout}/>
          </IconButton>
        </div>
      </StyledHeader>

      <StyledSearch>
        <Search/>
        <StyledSearchInput placeholder='Search in conversations'/>
      </StyledSearch>

      <StyledSidebarButton
        onClick={() => setIsOpenNewConversationDialog(true)}
      >
        Start a new conversation
      </StyledSidebarButton>

       List of conversations
      {conversationsSnapshot?.docs.map(conversation => (
        <ConversationSelect
          key={conversation.id}
          id={conversation.id}
          conversationUsers={(conversation.data() as Conversation).users}
        />
      ))}

      <Dialog open={isOpenNewConversationDialog} onClose={closeNewConversationDialog}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewConversationDialog}>Cancel</Button>
          <Button disabled={!recipientEmail} onClick={createConversation}>Create</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default Sidebar;
