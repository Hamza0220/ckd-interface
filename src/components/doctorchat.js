import React, { useEffect, useState } from 'react';
import { firestore } from './firebaseconfig';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import './doctorchat.scss';

function DoctorChat() {
  const [username, setUsername] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const db = firestore;

    const fetchMessages = async () => {
      if (username) {
        const q = query(collection(db, 'messages'), orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const messageData = [];
          snapshot.forEach((doc) => {
            messageData.push(doc.data());
          });
          setMessages(messageData);
        });

        // Cleanup
        return () => {
          unsubscribe();
        };
      }
    };

    fetchMessages();
  }, [username]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (username.trim() !== '') {
      setJoined(true);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const timestamp = serverTimestamp();
    const message = messageInput;

    setMessageInput('');

    const db = firestore;
    await addDoc(collection(db, 'messages'), {
      username,
      message,
      timestamp,
    });
  };

  const handleLeaveChat = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLeave = () => {
    // Add any necessary cleanup or redirection logic here
    const db = firestore;
  
    // Clear all messages from the Firestore collection
    const messagesCollection = collection(db, 'messages');
    const q = query(messagesCollection);
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    });
  
    // Reset the message input field and hide the confirmation modal
    setMessageInput('');
    setShowConfirmation(false);
  
    // Add any additional logic here, such as redirection
    window.location.href = '/DoctorDashboard'; // Replace with your desired URL
  };
  

  const handleCancelLeave = () => {
    setShowConfirmation(false);
  };

  return (
    <div className='DoctorChat'>
      <header>
        <h2>Doctor's Chat</h2>
      </header>
      {!joined ? (
        <form onSubmit={handleNameSubmit}>
          <label>Enter your name:</label>
          <input
            type='text'
            placeholder='Your Name'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button id='joinchat' type='submit'>
            Join Chat
          </button>
        </form>
      ) : (
        <div id='chat'>
          {showConfirmation ? (
            <div className='confirmation-modal'>
              <p id='are-you-sure-message'>
                Are you sure you want to leave the chat?
              </p>
              <div className='confirmation-buttons'>
                <button id='yes' onClick={handleConfirmLeave}>
                  Yes
                </button>
                <button id='no' onClick={handleCancelLeave}>
                  No
                </button>
              </div>
            </div>
          ) : (
            <>
              <div id='message-container'>
                <ul id='messages'>
                  {messages.map((message, index) => (
                    <li
                      key={index}
                      className={
                        message.username === 'doctor'
                          ? 'system'
                          : message.username === username
                          ? 'sent'
                          : 'receive'
                      }
                    >
                      <span>{message.username}: </span>
                      {message.message}
                    </li>
                  ))}
                </ul>
              </div>
              <form id='message-form' onSubmit={sendMessage}>
                <input
                  id='message-input'
                  type='text'
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button id='message-btn' type='submit'>
                  Send
                </button>
              </form>
              <button
                id='leavechat'
                className='leave-chat-button'
                onClick={handleLeaveChat}
              >
                Leave Chat
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DoctorChat;
