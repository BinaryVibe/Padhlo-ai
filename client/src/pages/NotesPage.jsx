import React, { useState, useEffect } from "react";
import "./notespage.css";
import NotesGeneratorBox from "../modules/notes-helper/components/NotesGeneratorBox";
import GeneratedNotes from "../modules/notes-helper/components/GeneratedNotes";
import { getNotesFromAI, getUserCategories, createCategory } from "../api/notesHelper"; // APNI API FILE KA NAAM YAHAN THEEK KAR LEIN
import axios from "axios";

const NotesPage = () => {

  const [generatedNotes, setGeneratedNotes] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // null = "All Notes"
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL;


  const handleGeneratedNotes = async (topic, roughNotes) => {
    setLoading(true);
    const explanation = await getNotesFromAI(topic, roughNotes);

    const newNote = { topic, explanation };
    setGeneratedNotes((prev) => [newNote, ...prev]);
    setLoading(false);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found. Skipping API call.");
        return;
      }
      
      try {
        const response = await axios.get(
          `${API_BASE_URL}/get-all-notes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const notes = response.data;

        const formattedNotes = notes.map((note) => ({
          topic: note.topic,
          explanation: note.content,
        }));

        setGeneratedNotes(formattedNotes);
      } catch (error) {
        console.error("Error fetching user notes:", error);
      }
    };

    fetchNotes();
  }, []);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getUserCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const result = await createCategory({ name: newFolderName });
      setCategories([result.category, ...categories]); // UI update bina refresh
      setShowModal(false);
      setNewFolderName("");
    } catch (error) {
      console.error("Error creating folder", error);
      alert("Failed to create folder!");
    }
  };


  return (
    <div className="notes-page-layout">
      
      {/* --- NEW SIDEBAR --- */}
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
            >
              📁 {cat.name}
            </li>
          ))}
        </ul>
      </div>

      {/* --- AAPKA EXISTING UI (Wrapped in main-content) --- */}
      <div className="main-content">
        <div className="parent-div">
          <div className="main-heading">
            <h1 className="text">Notes Helper</h1>
            <h6 className="text slogan">
              Turn Rough Notes into Perfect Study Material
            </h6>
          </div>

          <div className="notes-generator-box">
            <NotesGeneratorBox onGenerate={handleGeneratedNotes} />
          </div>

          {loading && <div className="loader"></div>}

          <div className="generated-notes-box">
            {generatedNotes.map((note, index) => (
              <GeneratedNotes
                key={index}
                topic={note.topic}
                explanation={note.explanation}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- NEW MODAL FOR CREATE FOLDER --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Folder</h3>
            <input 
              type="text" 
              className="folder-input"
              placeholder="e.g., Advanced Database..." 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button className="save-btn" onClick={handleCreateFolder}>Save</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NotesPage;