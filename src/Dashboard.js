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

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

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

  const handleChangePassword = () => {
    alert('Change password clicked!');
  };

  const handleSettings = () => {
    alert('Settings clicked!');
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user, fetchNotes]);

  return (
    <>/* rest of the component remains unchanged */</>
  );
}

export default Dashboard;