import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { db } from '../config/firebase'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { storage } from '../config/firebase';
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";

function PostFeed() {
  const {chatRoomId} = useParams();
  const [list, setList] = useState([]) // State to store the chat room list
  const [title, setTitle] = useState('') // State to store the input field value
  const [message, setMessage] = useState('');

  const listCollection = collection(db, 'chat_room') // Reference to the 'chat_room' collection in Firestore

  useEffect(() => {
    getList() // Fetch the chat room list on component mount
    getDocument(chatRoomId)
  }, [])

  const getList = async () => {
    try {
      // Subscribe to real-time updates on the chat room collection, ordered by timestamp in descending order
      const unsubscribe = onSnapshot(query(listCollection, orderBy('timestamp', 'desc')), (snapshot) => {
        // Map the document data and add an 'id' property to each document
        const updatedList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setList(updatedList) // Update the chat room list state with the updated data
      })
      return () => unsubscribe() // Unsubscribe from real-time updates when the component unmounts
    } catch (error) {
      console.error(error)
    }
  }

  const save = async () => {
    try {
      if (title.trim() === '') {
        return // If the title is empty or contains only whitespace, do not save
      }

      // Add a new document to the chat room collection with the provided title and server timestamp
      await addDoc(listCollection, {
        title,
        timestamp: serverTimestamp()
      })

      setTitle('') // Clear the input field after saving
    } catch (error) {
      console.error(error)
    }
  }

  const getDocument = async (documentId) => {
    try {
      const docRef = doc(db, 'chat_room', documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const documentData = { ...docSnap.data(), id: docSnap.id };
        setTitle(documentData.title);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fileUpload = async (file) => {
    if (!file) {
      return;
    }

    const storageRef = ref(storage, `chat/${chatRoomId}/${Date.parse(new Date())}_${file.name}`);
    const result = await uploadBytes(storageRef, file);
    console.log('result ', result);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('downloadURL', downloadURL);

    await addDoc(listCollection, {
      message,
      senderName: user.displayName ?? user.email,
      senderId: user.uid,
      chatRoomId: chatRoomId,
      image: downloadURL,
      timestamp: serverTimestamp()
    });
  };

  return (
    <>
      <h1>Post Feed</h1>
      <input
        type='text'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={save}>Save</button>
      
      <button onClick={save}>Send</button>
      <input type='file' onChange={(e) => fileUpload(e.target.files[0])} />
      {
        list.map((item, index) => (
          item.timestamp ? <div key={index}>
            <Link to={`/chat/${item.id}`}>
              <h3>{item.title}</h3>
            </Link>
            <p>{item.timestamp?.toDate().toLocaleString()}</p>
          </div> : null
        ))
      }
    </>
  )
}

export default PostFeed;