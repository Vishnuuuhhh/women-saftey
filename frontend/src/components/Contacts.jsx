import { useState, useEffect } from "react";

function Contacts(){

  const [contacts,setContacts]=useState([]);
  const [showModal,setShowModal]=useState(false);
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");

  const fetchContacts = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/contacts`,
      {
        headers:{
          "Authorization":`Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if(res.ok){
      setContacts(data);
    }

  };

  useEffect(()=>{
    fetchContacts();
  },[]);

  const addContact = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/contacts`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        },
        body:JSON.stringify({name,phone})
      }
    );

    if(res.ok){

      alert("Contact added");

      setShowModal(false);
      setName("");
      setPhone("");

      fetchContacts();

    }

  };

  const deleteContact = async (id) => {

    const token = localStorage.getItem("token");

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/contacts/${id}`,
      {
        method:"DELETE",
        headers:{
          "Authorization":`Bearer ${token}`
        }
      }
    );

    fetchContacts();

  };

  return(

    <div className="card">

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h2>Emergency Contacts</h2>

        <button
          className="primary-button"
          style={{width:"auto",padding:"8px 12px"}}
          onClick={()=>setShowModal(true)}
        >
          + Add Contact
        </button>
      </div>

      {contacts.length === 0 && (
        <p style={{color:"#777",marginTop:"10px"}}>
          No contacts added yet
        </p>
      )}

      {contacts.map(contact => (

        <div key={contact._id} className="contact-item">

          <div className="contact-info">
            <strong>{contact.name}</strong>
            <span>{contact.phone}</span>
          </div>

          <button
            className="delete-btn"
            onClick={() => deleteContact(contact._id)}
          >
            Delete
          </button>

        </div>

      ))}

      {showModal &&

        <div className="contact-modal">

          <h3>Add Emergency Contact</h3>

          <input
            placeholder="Contact Name"
            value={name}
            onChange={e=>setName(e.target.value)}
          />

          <input
            placeholder="Phone Number"
            value={phone}
            onChange={e=>setPhone(e.target.value)}
          />

          <button className="primary-button" onClick={addContact}>
            Save Contact
          </button>

          <button
            className="cancel-btn"
            onClick={()=>setShowModal(false)}
          >
            Cancel
          </button>

        </div>

      }

    </div>

  );

}

export default Contacts;