import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, MessageSquare, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

const SocketChat = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [room, setRoom] = useState('general');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize Socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Join room
    newSocket.emit('join_room', room);

    // Fetch initial history from backend API
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('greenthumb_token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/chat/${room}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.data) {
          setMessages(res.data.data);
        }
      } catch (err) {
        console.warn('Chat history fetch notice:', err.message);
      }
    };
    fetchHistory();

    // Listen for incoming messages
    newSocket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const msgData = {
        room,
        sender: user?.id || user?._id,
        senderName: user?.name || 'Gardener',
        senderAvatar: user?.avatar || '',
        message: inputMessage.trim(),
      };

      socket.emit('send_message', msgData);
      setInputMessage('');
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '500px' }}>
      {/* Header */}
      <div style={{ background: '#064e3b', color: '#ffffff', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} color="#34d399" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>
            Live Gardener Chat
          </h3>
        </div>

        <select
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={{
            background: '#047857',
            color: '#ffffff',
            border: 'none',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            outline: 'none',
          }}
        >
          <option value="general"># General Care</option>
          <option value="succulents"># Succulents & Cacti</option>
          <option value="propagation"># Propagation</option>
        </select>
      </div>

      {/* Messages Stream */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8faf7' }}>
        {messages.map((msg, index) => {
          const isMe = user && (msg.sender === user.id || msg.sender === user._id || msg.senderName === user.name);
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '8px',
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              {!isMe && (
                <img
                  src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={msg.senderName}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block', marginBottom: '2px', textAlign: isMe ? 'right' : 'left' }}>
                  {msg.senderName}
                </span>
                <div
                  style={{
                    background: isMe ? '#10b981' : '#ffffff',
                    color: isMe ? '#ffffff' : '#1f2937',
                    padding: '8px 14px',
                    borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    fontSize: '0.875rem',
                  }}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} style={{ padding: '0.75rem', background: '#ffffff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          className="form-control"
          placeholder={`Type a real-time message in #${room}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          style={{ borderRadius: '9999px', fontSize: '0.85rem' }}
        />
        <button type="submit" className="btn btn-primary" style={{ borderRadius: '9999px', padding: '0.5rem 1rem' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default SocketChat;
