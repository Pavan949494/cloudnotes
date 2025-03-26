// src/Dashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Dashboard() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const user = auth.currentUser;

  const fetchNotes = async () => {
    const notesRef = collection(db, 'users', user.uid, 'notes');
    const q = query(notesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const notesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotes(notesList);
  };

  const loadNote = async (noteId) => {
    const noteRef = doc(db, 'users', user.uid, 'notes', noteId);
    const noteSnap = await getDoc(noteRef);
    if (noteSnap.exists()) {
      setSelectedNoteId(noteId);
      setNoteTitle(noteSnap.data().title);
      setNoteContent(noteSnap.data().content);
    }
  };

  const handleSave = async () => {
    if (selectedNoteId) {
      const noteRef = doc(db, 'users', user.uid, 'notes', selectedNoteId);
      await updateDoc(noteRef, {
        title: noteTitle,
        content: noteContent,
      });
    } else {
      const notesRef = collection(db, 'users', user.uid, 'notes');
      const newNote = await addDoc(notesRef, {
        title: noteTitle || 'Untitled',
        content: noteContent,
        createdAt: new Date()
      });
      setSelectedNoteId(newNote.id);
      fetchNotes();
    }
  };

  const handleNewNote = async () => {
    const notesRef = collection(db, 'users', user.uid, 'notes');
    const newNote = await addDoc(notesRef, {
      title: 'Untitled',
      content: '',
      createdAt: new Date()
    });
    setSelectedNoteId(newNote.id);
    setNoteTitle('Untitled');
    setNoteContent('');
    fetchNotes();
  };

  const handleDelete = () => setShowConfirmDialog(true);

  const confirmDeleteNote = async () => {
    if (selectedNoteId) {
      await deleteDoc(doc(db, 'users', user.uid, 'notes', selectedNoteId));
      setSelectedNoteId(null);
      setNoteTitle('');
      setNoteContent('');
      fetchNotes();
      setShowConfirmDialog(false);
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/');
    });
  };

  const handleChangePassword = () => alert('Change password clicked!');
  const handleSettings = () => alert('Settings clicked!');

  useEffect(() => {
    if (user) fetchNotes();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user]);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: '100vh', backgroundColor: '#f5f7fa', fontFamily: 'Segoe UI, sans-serif' }}>
        <aside style={{ backgroundColor: '#1e293b', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#3b82f6' }}>☁️ Cloud Notes</div>
          <button onClick={handleNewNote} style={{ backgroundColor: '#3b82f6', border: 'none', padding: '10px', borderRadius: '6px', color: 'white', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' }}>+ New Note</button>
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            {notes.map(note => (
              <div
                key={note.id}
                onClick={() => loadNote(note.id)}
                style={{
                  padding: '10px',
                  backgroundColor: note.id === selectedNoteId ? '#2563eb' : 'transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  transition: 'background-color 0.2s',
                  color: note.id === selectedNoteId ? '#fff' : '#d1d5db'
                }}
              >
                {note.title || 'Untitled'}
              </div>
            ))}
          </div>
          <div style={{ position: 'relative', marginTop: 'auto' }} ref={dropdownRef}>
            <button onClick={() => setShowDropdown(!showDropdown)} style={{ backgroundColor: '#334155', color: '#fff', padding: '10px', borderRadius: '6px', width: '100%', textAlign: 'left' }}>
              {user?.email || 'Profile'} ⚙️
            </button>
            {showDropdown && (
              <div style={{ position: 'absolute', bottom: '50px', left: 0, backgroundColor: '#fff', color: '#000', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 10 }}>
                <button onClick={handleChangePassword} style={{ padding: '10px 20px', width: '100%', background: 'white', border: 'none', textAlign: 'left', cursor: 'pointer' }}>🔐 Change Password</button>
                <button onClick={handleSettings} style={{ padding: '10px 20px', width: '100%', background: 'white', border: 'none', textAlign: 'left', cursor: 'pointer' }}>⚙️ Settings</button>
                <hr style={{ margin: 0 }} />
                <button onClick={handleLogout} style={{ padding: '10px 20px', width: '100%', background: 'white', border: 'none', color: 'red', textAlign: 'left', cursor: 'pointer' }}>🚪 Logout</button>
              </div>
            )}
          </div>
        </aside>

        <main style={{ padding: '40px', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
          <input
            placeholder="Note Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            style={{ padding: '12px', fontSize: '20px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '20px' }}
          />

          <ReactQuill
            theme="snow"
            value={noteContent}
            onChange={setNoteContent}
            style={{ flexGrow: 1, borderRadius: '6px', backgroundColor: '#fff', marginBottom: '20px' }}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link'],
                ['clean']
              ]
            }}
            formats={[
              'header', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'list', 'bullet', 'link'
            ]}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '16px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', marginTop: '20px' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '12px 24px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              💾 Save
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🗑 Delete
            </button>
          </div>
        </main>
      </div>

      {showConfirmDialog && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
        }}>
          <div style={{
            background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            maxWidth: '400px', textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Are you sure you want to delete this note?</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button onClick={confirmDeleteNote} style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Yes, Delete</button>
              <button onClick={() => setShowConfirmDialog(false)} style={{ padding: '10px 20px', backgroundColor: '#9ca3af', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
