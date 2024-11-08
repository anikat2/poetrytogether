import './App.css';
import app from './configuration';
import { getDatabase, ref, push, set, update, onValue } from "firebase/database";
import { useEffect, useState } from 'react';
import AdsComponent from './AdsComponent';

const App = () => {
  const [currentPoem, setCurrentPoem] = useState(null);
  const [currentPoemKey, setCurrentPoemKey] = useState(null);
  const [newSubNodeText, setNewSubNodeText] = useState('');

  const fetchData = () => {
    const db = getDatabase(app);
    const collectionRef = ref(db, "poems");

    onValue(collectionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const poemKeys = Object.keys(data);
        const randomIndex = Math.floor(Math.random() * poemKeys.length);
        const chosenKey = poemKeys[randomIndex];
        const chosenPoem = data[chosenKey];

        setCurrentPoem(chosenPoem);
        setCurrentPoemKey(chosenKey);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createNewPoem = () => {
    const db = getDatabase(app);
    const collectionRef = ref(db, "poems");

    const newPoemRef = push(collectionRef);

    set(newPoemRef, { content: "" })
      .then(() => {
        console.log('New poem created!');
        fetchData();
      })
      .catch((error) => {
        console.error('Error creating new poem:', error);
      });
  };

  const handleSubmitSubNode = () => {
    if (!newSubNodeText || !currentPoemKey) return;

    const db = getDatabase(app);
    const poemRef = ref(db, `poems/${currentPoemKey}`);

    const newLineKey = push(poemRef).key;

    update(poemRef, {
      [newLineKey]: newSubNodeText
    })
      .then(() => {
        console.log('Subnode added!');
        setNewSubNodeText('');
        fetchData();
      })
      .catch((error) => {
        console.error('Error adding subnode:', error);
      });
  };

  return (
    <div className="App">
      <div className='leftColumn'>
        <AdsComponent dataAdSlot='2045138080' />
      </div>
      <div className='body'>
        <h1 className="title">poetry is not a solitary art.</h1>
        <br />
        <div className="options">
          <button id="skip" onClick={createNewPoem}>🔃</button>
        </div>
        {currentPoem && (
          <div className='poem'>
            <div className='inputfield'>
              <input id="input" type="text" value={newSubNodeText} onChange={(e) => setNewSubNodeText(e.target.value)} placeholder="add your line" />
              <button id="submitButton" onClick={handleSubmitSubNode}>✔️</button>
            </div>

            {Object.keys(currentPoem).filter(key => key !== 'key').map(lineKey => (
              <p key={lineKey}>{currentPoem[lineKey]}</p>
            ))}
          </div>
        )}
      </div>
      <div className='rightColumn'>
        <AdsComponent dataAdSlot='5654605832' />
      </div>
    </div>
  );
};

export default App;
