import React, { useState, useEffect } from "react";
import "./notespage.css";
import NotesGeneratorBox from "../modules/notes-helper/components/NotesGeneratorBox";
import GeneratedNotes from "../modules/notes-helper/components/GeneratedNotes";
import { getNotesFromAI, getUserCategories, createCategory, deleteCategory, renameCategory } from "../api/notesHelper"; 
import axios from "axios";

const NotesPage = () => {

  const [generatedNotes, setGeneratedNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // New States for 3-Dots Menu & Rename
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [folderToRename, setFolderToRename] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");

  const handleGeneratedNotes = async (topic, roughNotes) => {
    setLoading(true);
    // FIX: Passed selectedCategoryId here!
    const explanation = await getNotesFromAI(topic, roughNotes, selectedCategoryId);

    const newNote = { topic, explanation, categoryId: selectedCategoryId };
    setGeneratedNotes((prev) => [newNote, ...prev]);
    setLoading(false);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-all-notes`, // FIX: Used env variable instead of hardcoded Railway link
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const formattedNotes = response.data.map((note) => ({
          _id: note._id,
          topic: note.topic,
          explanation: note.content,
          categoryId: note.categoryId, 
        }));
        setGeneratedNotes(formattedNotes);
      } catch (error) { console.error("Error fetching notes:", error); }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getUserCategories();
        setCategories(data);
      } catch (error) { console.error("Error fetching categories:", error); }
    };
    fetchCategories();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const result = await createCategory({ name: newFolderName });
      setCategories([result.category, ...categories]); 
      setShowModal(false);
      setNewFolderName("");
    } catch (error) { alert("Failed to create folder!"); }
  };

  const handleDeleteFolder = async (categoryId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this folder?");
    if (!confirmDelete) return;
    try {
      await deleteCategory(categoryId); 
      setCategories(categories.filter((cat) => cat._id !== categoryId)); 
      if (selectedCategoryId === categoryId) setSelectedCategoryId(null);
    } catch (error) { alert("Failed to delete folder!"); }
  };

  // NEW: Handle Rename Logic
  const handleRenameFolder = async () => {
    if (!editFolderName.trim() || !folderToRename) return;
    try {
      const result = await renameCategory(folderToRename, editFolderName);
      setCategories(categories.map(cat => cat._id === folderToRename ? result.category : cat));
      setShowRenameModal(false);
      setFolderToRename(null);
      setEditFolderName("");
    } catch (error) { alert("Failed to rename folder!"); }
  };

  const displayedNotes = selectedCategoryId === null 
    ? generatedNotes 
    : generatedNotes.filter(note => note.categoryId === selectedCategoryId);

  return (
    <div className="notes-page-layout" onClick={() => setActiveDropdown(null)}> {/* Close dropdown if clicked outside */}
      
      <div className="sidebar">
        <h3 className="sidebar-title">My Folders</h3>
        <button className="create-folder-btn" onClick={() => setShowModal(true)}>
          + New Folder
        </button>
        
        <ul className="folder-list">
          <li 
            className={selectedCategoryId === null ? "active-folder" : ""}
            onClick={() => setSelectedCategoryId(null)}
          >
            📂 All Notes
          </li>
          
          {categories.map((cat) => (
            <li 
              key={cat._id} 
              className={selectedCategoryId === cat._id ? "active-folder" : ""}
              onClick={() => setSelectedCategoryId(cat._id)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }} 
            >
              <span style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>📁 {cat.name}</span>
              
              {/* 3-Dots Menu Button */}
              <button 
                className="three-dots-btn"
                onClick={(e) => {
                  e.stopPropagation(); 
                  setActiveDropdown(activeDropdown === cat._id ? null : cat._id);
                }}
              >
                ⋮
              </button>

              {/* Dropdown Menu */}
              {activeDropdown === cat._id && (
                <div className="dropdown-menu">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setFolderToRename(cat._id);
                    setEditFolderName(cat.name);
                    setShowRenameModal(true);
                    setActiveDropdown(null);
                  }}>✏️ Rename</button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(cat._id);
                    setActiveDropdown(null);
                  }} style={{color: 'red'}}>🗑️ Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="parent-div">
          <div className="main-heading">
            <h1 className="text">Notes Helper</h1>
            <h6 className="text slogan">Turn Rough Notes into Perfect Study Material</h6>
          </div>
          <div className="notes-generator-box">
            <NotesGeneratorBox onGenerate={handleGeneratedNotes} />
          </div>
          {loading && <div className="loader"></div>}
          <div className="generated-notes-box">
            {displayedNotes.map((note, index) => (
              <GeneratedNotes key={index} topic={note.topic} explanation={note.explanation} />
            ))}
          </div>
        </div>
      </div>

      {/* CREATE Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Folder</h3>
            <input type="text" className="folder-input" placeholder="e.g., Advanced Database..." value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} autoFocus />
            <div className="modal-actions">
              <button className="save-btn" onClick={handleCreateFolder}>Save</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME Modal */}
      {showRenameModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Rename Folder</h3>
            <input type="text" className="folder-input" value={editFolderName} onChange={(e) => setEditFolderName(e.target.value)} autoFocus />
            <div className="modal-actions">
              <button className="save-btn" onClick={handleRenameFolder}>Save</button>
              <button className="cancel-btn" onClick={() => setShowRenameModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NotesPage;